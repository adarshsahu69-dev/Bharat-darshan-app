/**
 * Generates supabase/seed.sql from src/data/monuments.ts.
 * Run with:  node --experimental-strip-types scripts/seed-sql.ts
 *
 * It reads the seed data, escapes strings for SQL, and emits INSERT
 * statements grouped per category so importing is easy to review.
 */
import { allMonuments, homeCategories } from '../src/data/monuments.ts';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

function escapeSql(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : 'NULL';
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

function arraySql(values: string[]): string {
  if (values.length === 0) {
    return "ARRAY[]::text[]";
  }
  return `ARRAY[${values.map((v) => `'${v.replace(/'/g, "''")}'`).join(',')}]`;
}

const lines: string[] = [
  '-- Bharat Darshan seed data. Import into the Supabase SQL editor.',
  '-- Generated from src/data/monuments.ts. Replace image_url with real',
  '-- Supabase Storage paths once the bucket is populated.',
  '',
  'BEGIN;',
  '',
  `-- ${allMonuments.length} monuments across ${homeCategories.length} categories.`,
  '',
];

for (const monument of allMonuments) {
  lines.push(
    `INSERT INTO public.monuments (`,
    `  id, name, state, city, category, categories, description, lat, lng,`,
    `  image_url, ticket_inr, timings, rating, review_count, is_unesco`,
    `) VALUES (`,
    `  ${escapeSql(monument.id)},`,
    `  ${escapeSql(monument.name)},`,
    `  ${escapeSql(monument.state)},`,
    `  ${escapeSql(monument.city)},`,
    `  ${escapeSql(monument.category)},`,
    `  ${arraySql(monument.categories)},`,
    `  ${escapeSql(monument.description ?? null)},`,
    `  ${escapeSql(monument.lat)},`,
    `  ${escapeSql(monument.lng)},`,
    `  ${escapeSql(monument.image ?? null)},`,
    `  ${escapeSql(monument.ticketPrice)},`,
    `  ${escapeSql(monument.timings ?? null)},`,
    `  ${escapeSql(monument.rating)},`,
    `  ${escapeSql(monument.reviewCount ?? null)},`,
    `  ${escapeSql(monument.isUnesco ?? false)},`,
    `);`,
  );
}

lines.push('', 'COMMIT;', '');

const out = join(process.cwd(), 'supabase', 'seed.sql');
writeFileSync(out, lines.join('\n'), 'utf8');
console.log(`Wrote ${out} (${allMonuments.length} rows)`);