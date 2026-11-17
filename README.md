# Bharat Darshan

An Android-first React Native app for exploring India's forts, temples and heritage circuits.

## Stack

- React Native + Expo SDK 58, TypeScript, Expo Router
- Supabase for data and auth
- react-native-maps for the heritage map
- expo-font: Playfair Display (headings), Inter (body)
- Zustand + AsyncStorage for offline trip data

## Prerequisites

- Node.js 20+
- Expo Go on a device, or an Android/iOS emulator
- A Supabase project for live data (optional for the scaffold)

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from your
Supabase project's API settings.

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

## Project structure

```
app/
  _layout.tsx          # font loading, theme provider, root navigator
  (tabs)/
    _layout.tsx        # bottom tabs: Home, Explore, Map, Trips
    index.tsx          # Home
    explore.tsx        # Explore
    map.tsx            # Heritage map
    trips.tsx          # Trip planner
  +not-found.tsx
src/
  theme/               # all design tokens and theme provider
  components/          # reusable UI (added in step 2)
```

## Design system

All tokens live in `src/theme/index.ts` — colours, typography, spacing, radii and
warm shadows. Never hard-code colours or fonts in components; use `useTheme()`.

Palette: terracotta `#B34A12`, royal indigo `#1F2A5C`, sandstone `#FBF4E9`,
gold `#D4A017`. Light and dark themes are both supported.