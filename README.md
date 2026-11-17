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

### Google Maps API key (Map tab)

The Heritage Map uses `react-native-maps`. On Android, map tiles require a
Google Maps API key; on iOS and in Expo Go the default Apple/Google provider is
used and no key is needed for development.

1. Open https://console.cloud.google.com/ and create (or pick) a project.
2. Enable **Maps SDK for Android** under *APIs & Services → Library*.
3. Create an API key under *APIs & Services → Credentials* and restrict it to
   your Android app's package name (`com.anonymous.bharatdarshan` by default)
   plus your debug/release SHA-1.
4. Add it to `.env`:

   ```bash
   EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY=your-real-key
   ```

`app.config.ts` reads that variable and injects it into
`android.config.googleMaps.apiKey`. A placeholder
(`YOUR_GOOGLE_MAPS_ANDROID_KEY`) is used when the variable is unset, so the app
builds and runs without crashing — the Android map just renders blank tiles
until you supply a real key. Rebuild the native app (`npx expo run:android` or
a new EAS build) after changing the key; it is not picked up by Metro alone.

### Map implementation notes

- Native builds (Android/iOS) render the real `<MapView>` from
  `react-native-maps` in `src/components/NativeMapCanvas.tsx`.
- `react-native-maps` has no web implementation, so the web build and static
  export use a styled fallback canvas (`src/components/MapCanvas.tsx`) that
  mirrors the native layout. The native module is `require`d lazily so the web
  bundle never evaluates it.
- Both platforms share `src/components/MapPreviewSheet.tsx` (bottom sheet) and
  `src/components/MapCategoryChips.tsx` (category filters).
- Markers are mock pins in `src/data/map.ts`; swap for a GeoJSON/cluster layer
  when the data layer lands.

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
    map.tsx            # Heritage map (react-native-maps)
    trips.tsx          # Trip planner
  +not-found.tsx
src/
  theme/               # all design tokens and theme provider
  components/          # reusable UI (cards, chips, map canvas, sheets)
  data/                # mock data (monuments, trips, map)
```

## Design system

All tokens live in `src/theme/index.ts` — colours, typography, spacing, radii and
warm shadows. Never hard-code colours or fonts in components; use `useTheme()`.

Palette: terracotta `#B34A12`, royal indigo `#1F2A5C`, sandstone `#FBF4E9`,
gold `#D4A017`. Light and dark themes are both supported.