name: "Bharat Darshan Design System" description: "A warm, culturally rich, Material 3-inspired design system for exploring India's monumental heritage, forts, temples, and cultural circuits."
Overview
Bharat Darshan connects travelers to the grand living heritage, architecture, and sacred geometry of India. The visual aesthetic pairs the timeless elegance of royal Rajputana and Mughal stone architecture with clean, modern Material 3 ergonomics. High-contrast typography, large scenic photography, soft rounded cards, and warm atmospheric surfaces ground the experience in a welcoming and celebratory Indian ethos without visual clutter.
Colors
The palette takes inspiration from historic Indian landscapes: deep saffron terracotta (#C2571A) evoking sacred stone, royal indigo (#1F2A5C) reflecting dusk and regal tapestries, warm sandstone cream (#FBF4E9) mimicking Jaisalmer and Fatehpur Sikri sandstone, and burnished gold (#D4A017) honoring craftsmanship and starlight.
Primary: Terracotta / Deep Saffron for pivotal buttons, active bottom-bar indicators, and key highlights.
Secondary: Royal Indigo for architectural anchors, prominent category chips, and deep tonal contrasts.
Accent & Gold: Burnished gold for ratings, UNESCO badges, and celebratory markers.
Surface & Background: Warm sandstone cream surface tiers that maintain comfortable daytime legibility.
colors:
  gold: "#D4A017"
  gold-container: "#FDF5DE"
  on-gold: "#382800"
  light:
    primary: "#B34A12"
    on-primary: "#FFFFFF"
    primary-container: "#FFDBCE"
    on-primary-container: "#3B1000"
    secondary: "#1F2A5C"
    on-secondary: "#FFFFFF"
    secondary-container: "#DFE0FF"
    on-secondary-container: "#061343"
    surface: "#FBF4E9"
    on-surface: "#211A15"
    surface-variant: "#EFE5D6"
    on-surface-variant: "#51443B"
    surface-container-low: "#F5EDE0"
    surface-container: "#EFE7D8"
    surface-container-high: "#E9DFCE"
    outline: "#857367"
    outline-variant: "#D6C7B7"
  dark:
    primary: "#FFB596"
    on-primary: "#5F2200"
    primary-container: "#8A3300"
    on-primary-container: "#FFDBCE"
    secondary: "#BAC3FF"
    on-secondary: "#232F61"
    secondary-container: "#3A4578"
    on-secondary-container: "#DFE0FF"
    surface: "#1A1410"
    on-surface: "#ECE0D7"
    surface-variant: "#51443B"
    on-surface-variant: "#D6C7B7"
    surface-container-low: "#231B15"
    surface-container: "#2B221B"
    surface-container-high: "#362C24"
    outline: "#9F8D80"
    outline-variant: "#51443B"
Typography
The typography pairs Playfair Display, a classical high-contrast serif inspired by royal proclamations and architectural inscriptions, with Inter, a crystal-clear geometric sans-serif for labels, body copy, and metadata.
typography:
  display-lg:
    fontFamily: "Playfair Display"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 48px
    letterSpacing: -0.5px
  display-lg-mobile:
    fontFamily: "Playfair Display"
    fontSize: 30px
    fontWeight: 700
    lineHeight: 38px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: "Playfair Display"
    fontSize: 34px
    fontWeight: 700
    lineHeight: 42px
    letterSpacing: -0.25px
  headline-lg-mobile:
    fontFamily: "Playfair Display"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 34px
    letterSpacing: 0px
  headline-md:
    fontFamily: "Playfair Display"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 28px
  headline-sm:
    fontFamily: "Playfair Display"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
  title-lg:
    fontFamily: "Inter"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
  title-md:
    fontFamily: "Inter"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 20px
  title-sm:
    fontFamily: "Inter"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 18px
  body-lg:
    fontFamily: "Inter"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md:
    fontFamily: "Inter"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-sm:
    fontFamily: "Inter"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  label-lg:
    fontFamily: "Inter"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  label-md:
    fontFamily: "Inter"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
  label-sm:
    fontFamily: "Inter"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 14px
    letterSpacing: 0.5px
Layout & Spacing
Layout adheres to an 8px modular spacing rhythm optimized for handheld mobile reach (390px base viewport). Content cards feature generous touch targets (minimum 44x44px for actions), 16px edge padding for comfortable thumb framing, and floating navigation chrome with bottom-anchored call-to-actions.
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 16px
  gutter-lg: 24px
  gutter-xl: 32px
  section: 40px
  page-margin: 16px
Elevation & Depth
Surfaces follow Material 3 tonal elevation and soft ambient warm-tinted shadows. Rather than sharp black drops, shadows incorporate subtle warm amber tones (rgba(70, 35, 10, 0.08)) that blend naturally into the sandstone cream ground. Active cards and floating controls utilize subtle borders (border-outline-variant/30) to retain structural crispness.
Shapes
Shapes feature rounded corners ranging from 12px to 24px. Standard content cards use 18px radius, bottom sheets and hero headers use 28px top radii, and action chips use pill shapes (rounded-full).
rounded:
  sm: 6px
  DEFAULT: 12px
  md: 16px
  lg: 20px
  xl: 28px
  full: 9999px
Motion & Micro-interaction
Motion is polite, grounding, and purposeful. Tabs transition smoothly with spring dynamics; bottom sheets glide into viewport with decelerating curves.
motion:
  state-change:
    duration: 150ms
    delay: 0ms
    timingFunction: cubic-bezier(0.4, 0, 0.2, 1)
  surface-enter:
    duration: 280ms
    delay: 0ms
    timingFunction: cubic-bezier(0, 0, 0.2, 1)
  surface-exit:
    duration: 180ms
    delay: 0ms
    timingFunction: cubic-bezier(0.4, 0, 1, 1)
Voice & Content Strategy
The voice is reverent, knowledgeable, and inviting—like an erudite, culturally grounded local companion.
Use authentic Indian historical terminology accurately (e.g. Jharokha, Vimana, Ghats, Ramparts, Stepwells).
Currency amounts are explicitly rendered in Indian Rupees (₹).
Distance figures use kilometers (km).
Date formats use day and short month (e.g., 18 Nov 2026).
Actions are active and descriptive (Add to Trip, Get Directions, View Route, Explore State).
Components
Component implementations live as individual HTML sticker sheet files in components/. Each file contains the canonical, styled HTML components with <!-- COMPONENT: name --> comment markers. Read each file before use.
Button → @components/button.html: button-primary, button-icon, button-with-icon
Card → @components/card.html: card-elevated, card-action, card-interactive, card-interactive-2
Chip → @components/chip.html: chip-action, chip-input, chip-with-icon
Searchbar → @components/searchbar.html: searchbar-standard, searchbar-with-suggestions
Tabs → @components/tabs.html: tabs-horizontal, tabs-with-icon