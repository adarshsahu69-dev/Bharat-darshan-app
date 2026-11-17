You are building "Bharat Darshan", an Android app for exploring India's forts, temples, and heritage circuits. This repo is empty, so scaffold from scratch.

## Stack
- React Native + Expo (SDK latest), TypeScript, Expo Router
- Supabase for data and auth (reuse the existing schema from the BHARAT-DARSHAN website if available)
- react-native-maps for the heritage map
- expo-font: Playfair Display (headings), Inter (body)
- Zustand for state, AsyncStorage for offline trip data

## Design system (follow strictly)
Read /docs/bharat_darshan_design_system.md before writing any UI.
- Palette: terracotta primary #B34A12, royal indigo secondary #1F2A5C, sandstone surface #FBF4E9, gold #D4A017 (ratings, UNESCO badges). Support light and dark themes using the tokens in the file.
- Typography: Playfair Display for display/headline, Inter for title/body/label, using the sizes in the file.
- 8px spacing, 16px page margin, 44px minimum touch targets
- Radii: cards 18px, hero/bottom sheets 28px top, chips fully rounded
- Warm shadows: rgba(70,35,10,0.08)
- Voice: reverent and knowledgeable. Prices in ₹, distances in km, dates like "18 Nov 2026". Action labels: Add to Trip, Get Directions, View Route, Explore State.
- Put all tokens in one theme file (src/theme/) so nothing is hard-coded.

## Screens (match the Stitch designs)
1. Home: hero, featured monuments, state/circuit chips, search bar
2. Explore: search with suggestions, filter chips, monument cards
3. Monument details (e.g. Amber Fort): image gallery, history, timings, ticket price in ₹, UNESCO badge, Add to Trip, Get Directions
4. Heritage map: markers by category, bottom sheet preview on tap
5. Trip planner: day-wise itinerary, reorder stops, total km, View Route
Bottom tab bar: Home, Explore, Map, Trips. Active indicator in primary color.

## Components to build first
Button (primary, icon, with-icon), Card (elevated, action, interactive), Chip (action, input, with-icon), Searchbar (standard, with-suggestions), Tabs (horizontal, with-icon).

## Data model (Supabase)
monuments (id, name, state, city, category, description, lat, lng, image_url, ticket_inr, timings, is_unesco, rating), circuits, trips, trip_stops.
Seed 10 to 15 real monuments with accurate details.

## Rules
- Work in small steps: scaffold, theme + fonts, components, then one screen at a time. Make each step run before moving on.
- Never hard-code colors or fonts. Use theme tokens only.
- Handle loading, empty, and error states on every screen.
- Add a README with setup and run steps, plus a .env.example for Supabase keys.
- Commit after each completed step with a clear message.

Start with step 1: scaffold the project, set up Expo Router with the 4 tabs, load the fonts, and create the theme file from the design system. Stop and show me what you built.