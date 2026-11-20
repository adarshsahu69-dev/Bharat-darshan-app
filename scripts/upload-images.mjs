#!/usr/bin/env node
/**
 * One-time script: download monument images, upload to Supabase Storage, and
 * update public.monuments.image_url to the public storage URLs.
 *
 * Requirements:
 * - Node 18+ (built-in fetch)
 * - Official @supabase/supabase-js
 * - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from environment variables only
 *
 * Run:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-images.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'monument-images';
const USER_AGENT =
  'BharatDarshanApp/1.0 (student project; contact: <TODO: owner email>)';
const PAUSE_MS = 1500;
const MAX_RETRIES = 3;

const SPECIAL_IMAGE_ROWS = new Set([
  'chandigarh-palace',
  'umaibhawan-palace',
  'indian-museum',
]);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.',
  );
  console.error(
    'Set them only in your terminal session for this run. Never commit service role keys.',
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function encodeDownloadUrl(url) {
  try {
    const parsed = new URL(url);
    // Encode each path segment so spaces and other unsafe chars in file names are valid.
    parsed.pathname = parsed.pathname
      .split('/')
      .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
      .join('/');
    return parsed.toString();
  } catch {
    return encodeURI(url);
  }
}

async function fetchWithRetry(url, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 || response.status >= 500) {
        lastError = new Error(`HTTP ${response.status}`);
        if (attempt < MAX_RETRIES) {
          await sleep(PAUSE_MS * attempt);
          continue;
        }
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await sleep(PAUSE_MS * attempt);
        continue;
      }
    }
  }
  throw lastError ?? new Error('Download failed');
}

async function searchCommonsImage(name, city) {
  const srsearch = `${name} ${city ?? ''}`.trim();
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srnamespace: '6',
    srsearch,
    srlimit: '10',
    format: 'json',
    origin: '*',
  });
  const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Commons search failed: HTTP ${response.status}`);
  }
  const data = await response.json();
  const results = data?.query?.search ?? [];
  if (results.length === 0) {
    throw new Error(`No Commons file results for "${srsearch}"`);
  }

  const terms = srsearch
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 2);
  const pick =
    results.find((item) => {
      const title = String(item.title ?? '').toLowerCase();
      return /\.(jpg|jpeg|png|webp)$/i.test(title) &&
        terms.some((term) => title.includes(term));
    }) ??
    results.find((item) => /\.(jpg|jpeg|png|webp)$/i.test(String(item.title ?? ''))) ??
    results[0];

  const title = String(pick.title ?? '');
  if (!title.startsWith('File:')) {
    throw new Error(`Unexpected Commons result title: ${title}`);
  }
  const fileName = title.slice('File:'.length);
  const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1600`;
  return { fileName, imageUrl, srsearch };
}

async function resolveSourceUrl(row) {
  if (!SPECIAL_IMAGE_ROWS.has(row.id)) {
    return { url: row.image_url, pickedFile: null };
  }
  const { fileName, imageUrl, srsearch } = await searchCommonsImage(
    row.name,
    row.city,
  );
  console.log(
    `Picked Commons file for ${row.id} (${srsearch}): ${fileName}`,
  );
  return { url: imageUrl, pickedFile: fileName };
}

async function downloadImage(url) {
  const encodedUrl = encodeDownloadUrl(url);
  const response = await fetchWithRetry(encodedUrl, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'image/*,*/*;q=0.8',
    },
  });
  if (!response.ok) {
    throw new Error(`Download failed: HTTP ${response.status}`);
  }
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const arrayBuffer = await response.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('Downloaded image is empty');
  }
  return { data: new Uint8Array(arrayBuffer), contentType };
}

async function processRow(row) {
  const source = await resolveSourceUrl(row);
  if (!source.url) {
    throw new Error('Missing image_url');
  }

  const { data, contentType } = await downloadImage(source.url);
  const objectPath = `${row.id}/cover.jpg`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, data, {
      upsert: true,
      contentType,
    });
  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data: publicData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(objectPath);
  const publicUrl = publicData?.publicUrl;
  if (!publicUrl) {
    throw new Error('Could not get public URL');
  }

  const { error: updateError } = await supabase
    .from('monuments')
    .update({ image_url: publicUrl })
    .eq('id', row.id);
  if (updateError) {
    throw new Error(`Row update failed: ${updateError.message}`);
  }

  return { status: 'ok', error: '', pickedFile: source.pickedFile };
}

function printSummary(results) {
  const idWidth = Math.max(2, ...results.map((r) => r.id.length));
  const statusWidth = Math.max(6, ...results.map((r) => r.status.length));
  const header = `${'id'.padEnd(idWidth)}  ${'status'.padEnd(statusWidth)}  error`;
  const divider = `${'-'.repeat(idWidth)}  ${'-'.repeat(statusWidth)}  -----`;
  console.log('\n' + header);
  console.log(divider);
  for (const result of results) {
    console.log(
      `${result.id.padEnd(idWidth)}  ${result.status.padEnd(statusWidth)}  ${result.error}`,
    );
  }
  const ok = results.filter((r) => r.status === 'ok').length;
  const failed = results.length - ok;
  console.log(`\nSummary: ${ok} ok, ${failed} failed, ${results.length} total`);
}

async function main() {
  console.log('Fetching monuments from public.monuments...');
  const { data: rows, error } = await supabase
    .from('monuments')
    .select('id, name, city, image_url')
    .order('id', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch monuments: ${error.message}`);
  }
  if (!rows || rows.length === 0) {
    console.log('No monument rows found.');
    return;
  }

  console.log(`Processing ${rows.length} monuments...`);
  const results = [];

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    try {
      const result = await processRow(row);
      results.push({ id: row.id, status: 'ok', error: '' });
      if (result.pickedFile) {
        // Already printed at pick time for visibility.
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({ id: row.id, status: 'failed', error: message });
      console.error(`Failed ${row.id}: ${message}`);
    }

    if (i < rows.length - 1) {
      await sleep(PAUSE_MS);
    }
  }

  printSummary(results);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
