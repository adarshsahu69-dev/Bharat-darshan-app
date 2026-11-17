## Design system (follow strictly)
Read /docs/bharat_darshan_design_system.md before writing any UI.
- Palette: terracotta primary #B34A12, royal indigo secondary #1F2A5C, sandstone surface #FBF4E9, gold #D4A017 (ratings, UNESCO badges). Support light and dark themes using the tokens in the file.
- Typography: Playfair Display for display/headline, Inter for title/body/label, using the sizes in the file.
- 8px spacing, 16px page margin, 44px minimum touch targets
- Radii: cards 18px, hero/bottom sheets 28px top, chips fully rounded
- Warm shadows: rgba(70,35,10,0.08)
- Voice: reverent and knowledgeable. Prices in ₹, distances in km, dates like "18 Nov 2026". Action labels: Add to Trip, Get Directions, View Route, Explore State.
- Put all tokens in one theme file (src/theme/) so nothing is hard-coded.
