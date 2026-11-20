# Bharat Darshan

An Android-first React Native app for exploring India's forts, temples and heritage circuits.

## Stack

- React Native + Expo SDK 58, TypeScript, Expo Router
- Supabase (`@supabase/supabase-js`) for monuments data
- `@tanstack/react-query` for data fetching, caching, and retry
- `expo-image` for cached monument images (with themed fallback)
- expo-font: Playfair Display (headings), Inter (body)
- Zustand + AsyncStorage for offline trip data

## Prerequisites

- Node.js 20+
- Expo Go on a device, or an Android/iOS emulator
- A Supabase project (for live monument data)

## Setup

```bash
npm install
cp .env.example .env
```

Configure environment variables in `.env`:

- `EXPO_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon/public key (**anon key only**; never bundle the `service_role` key)

#### Where to find the Supabase credentials

1. Open the **Supabase Dashboard** and select your project.
2. Go to **Settings** (gear icon in the left sidebar) → **API**.
3. **Project URL** — copy the `https://<project>.supabase.co` URL into `EXPO_PUBLIC_SUPABASE_URL`.
4. **Anon (public) key** — copy the `anon` key from the *Project API keys* section into `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

The `anon` key is safe to ship in the app: it is what the client uses for all
requests. The `service_role` key is server-only and must never be committed or
bundled — row-level security enforces that even the anon key cannot write.

The app reads Supabase credentials from `EXPO_PUBLIC_SUPABASE_URL` and
`EXPO_PUBLIC_SUPABASE_ANON_KEY` (exposed via `app.config.ts` extras) and creates
the client in `src/lib/supabase.ts` using AsyncStorage-backed auth session
persistence.

## Supabase setup

Monument data is loaded from Supabase. Run the schema and seed SQL in the
Supabase SQL Editor, then configure image storage.

### 1. Create table, RLS policy, and storage bucket

Open **Supabase Dashboard → SQL Editor → New query**, paste the contents of
[`supabase/seed-schema.sql`](supabase/seed-schema.sql), and run it.

This creates:

- **`public.monuments` table**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key |
| `name` | `text` | Not null |
| `state` | `text` | Not null |
| `city` | `text` | Nullable |
| `category` | `text` | Not null, one of `Fort`, `Temple`, `Palace`, `Museum`, `Nature` |
| `categories` | `text[]` | Default `{}` |
| `description` | `text` | Nullable |
| `lat` | `double precision` | Nullable |
| `lng` | `double precision` | Nullable |
| `image_url` | `text` | Image URL (served from Supabase Storage) |
| `ticket_inr` | `integer` | Default `0` |
| `timings` | `text` | Nullable |
| `rating` | `numeric(2,1)` | Default `0` |
| `review_count` | `text` | Nullable |
| `is_unesco` | `boolean` | Default `false` |

- **Row Level Security (RLS):** enabled on `public.monuments` with a public
  `SELECT` policy for the `anon` role only (`"public read monuments"`). No
  client write access is granted.
- **Storage bucket:** `monument-images` (public). The schema SQL includes an
  `insert into storage.buckets ... on conflict do nothing` statement; you can
  also create/verify it in **Storage → New bucket** with name `monument-images`
  and **Public bucket** enabled.

Image objects in the bucket follow paths like `<monument-id>/cover.jpg` (e.g.
`amber-fort/cover.jpg`). App screens load images from the `image_url` column
(Supabase Storage URLs); do not use Wikimedia `Special:FilePath` or
`googleusercontent` URLs.

### 2. Seed monument data

After running the schema, seed rows by running
[`supabase/seed.sql`](supabase/seed.sql) in the SQL Editor. It contains `INSERT`
statements (34 monuments) generated from `src/data/monuments.ts` via
`scripts/seed-sql.ts`.

```bash
# Regenerate seed SQL from the seed data (optional)
node --experimental-strip-types scripts/seed-sql.ts
```

### 3. Verify

- Ensure `.env` has valid `EXPO_PUBLIC_SUPABASE_URL` and
  `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Start the app and confirm Home, Explore, and monument details load data from
  Supabase (with loading, error/retry, and empty states handled by React Query).

## Run

```bash
npm start
```

Then press `a` for Android, `i` for iOS, or `w` for the browser.

Other scripts:

```bash
npm run android   # Expo start --android
npm run ios       # Expo start --ios
npm run web       # Expo start --web
npm run typecheck # tsc --noEmit
```

## Scripts

One-time and maintenance scripts live in `scripts/`.

### Upload monument images to Supabase Storage

`scripts/upload-images.mjs` (Node 18+) downloads monument photos, uploads them to
the public `monument-images` bucket as `<id>/cover.jpg`, and updates each row's
`image_url` in `public.monuments` to the public storage URL.

```bash
SUPABASE_URL="https://<project>.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>" \
node scripts/upload-images.mjs
```

- Set `SUPABASE_SERVICE_ROLE_KEY` **only in the terminal session** for this run.
  **Never commit it**, never put it in `.env`, `.env.example`, or any tracked
  file, and never use it in the app client (the app must use the anon key).
- Uses the official `@supabase/supabase-js` client and built-in `fetch`.
- Fetches all `public.monuments` rows, downloads each source image with
  URL-encoded file names and a polite `User-Agent`, processes rows one at a time
  with a pause and retries on 429/5xx, uploads with `upsert: true` and correct
  `contentType`, updates `image_url`, and prints a summary table (id, status,
  error).
- For `chandigarh-palace`, `umaibhawan-palace`, and `indian-museum` it searches
  Wikimedia Commons for a better matching photo and prints the picked file for
  review.

`node --experimental-strip-types scripts/seed-sql.ts` regenerates `supabase/seed.sql` from seed data (optional).

## Project structure

```
app/
  _layout.tsx          # font loading, theme provider, root navigator
  (tabs)/
    _layout.tsx        # bottom tabs: Home, Explore, Saved, Trips
    index.tsx          # Home
    explore.tsx        # Explore
    saved.tsx          # Saved/bookmarked places
    trips.tsx          # Trip planner
  +not-found.tsx
src/
  theme/               # all design tokens and theme provider
  components/          # reusable UI (cards, chips, sheets)
  data/                # mock data (monuments, trips)
scripts/               # maintenance/one-time scripts
```

## Design system

All tokens live in `src/theme/index.ts` — colours, typography, spacing, radii and
warm shadows. Never hard-code colours or fonts in components; use `useTheme()`.

Palette: terracotta `#B34A12`, royal indigo `#1F2A5C`, sandstone `#FBF4E9`,
gold `#D4A017`. Light and dark themes are both supported.