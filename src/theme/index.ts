/**
 * Bharat Darshan design tokens.
 * Single source of truth for colours, typography, spacing, radii and shadows.
 * Never hard-code a colour, font size or font family in a component.
 *
 * Values mirror the Stitch export in docs/stitch/*.html.
 */

export const palette = {
  terracotta: '#B34A12',
  terracottaDeep: '#8F3A0E',
  royalIndigo: '#1F2A5C',
  sandstone: '#FBF4E9',
  gold: '#D4A017',
  goldSoft: '#FDE68A',
} as const;

const typographyBase = {
  displayLg: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.5,
    fontWeight: '700',
  },
  displayLgMobile: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -0.25,
    fontWeight: '700',
  },
  headlineLg: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: -0.25,
    fontWeight: '700',
  },
  headlineLgMobile: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: 0,
    fontWeight: '700',
  },
  headlineMd: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
  },
  headlineSm: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  titleLg: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  titleMd: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  titleSm: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  bodyLg: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyMd: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  bodySm: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  labelLg: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  labelMd: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  labelMdStrong: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  bodySmStrong: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  bodySmMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  labelSmMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  headlineSmBold: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  labelMdBold: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  labelSm: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  brand: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.25,
    fontWeight: '700',
  },
} as const;

export const typography = {
  ...typographyBase,
  // Backwards-compatible aliases used by the scaffold screens.
  display: typographyBase.headlineLg,
  headline: typographyBase.headlineSm,
  title: typographyBase.titleLg,
  body: typographyBase.bodyLg,
  label: typographyBase.labelLg,
  caption: typographyBase.bodySm,
};

export type Typography = typeof typography;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  section: 40,
  page: 16,
} as const;

export const radii = {
  xs: 4,
  sm: 6,
  default: 12,
  md: 16,
  card: 20,
  lg: 20,
  xl: 28,
  hero: 28,
  sheet: 28,
  chip: 999,
  full: 999,
} as const;

export const shadows = {
  warm: {
    shadowColor: 'rgba(70, 35, 10, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  warmSoft: {
    shadowColor: 'rgba(70, 35, 10, 0.08)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
} as const;

export const minTouchTarget = 44;

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceVariant: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  gold: string;
  goldSoft: string;
  goldContainer: string;
  onGold: string;
  emerald: string;
  error: string;
  success: string;
  overlay: string;
  // Tokens for content layered over photography.
  heroScrim: string;
  blackScrim: string;
  onImage: string;
  onImageMuted: string;
  onImageFaint: string;
  imageBorder: string;
  // Backwards-compatible aliases used by the scaffold screens.
  text: string;
  textMuted: string;
  border: string;
};

const lightBase: ThemeColors = {
  background: '#FBF4E9',
  surface: '#FBF4E9',
  surfaceContainerLow: '#F5EDE0',
  surfaceContainer: '#EFE7D8',
  surfaceContainerHigh: '#E9DFCE',
  surfaceVariant: '#EFE5D6',
  onSurface: '#211A15',
  onSurfaceVariant: '#51443B',
  outline: '#857367',
  outlineVariant: '#D6C7B7',
  primary: '#B34A12',
  onPrimary: '#FFFFFF',
  primaryContainer: '#FFDBCE',
  onPrimaryContainer: '#3B1000',
  secondary: '#1F2A5C',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#DFE0FF',
  onSecondaryContainer: '#061343',
  gold: '#D4A017',
  goldSoft: '#FDE68A',
  goldContainer: '#FDF5DE',
  onGold: '#382800',
  emerald: '#047857',
  error: '#B3261E',
  success: '#2E7D32',
  overlay: 'rgba(31, 42, 92, 0.32)',
  heroScrim: '31, 42, 92',
  blackScrim: '0, 0, 0',
  onImage: '#FFFFFF',
  onImageMuted: 'rgba(255, 255, 255, 0.8)',
  onImageFaint: 'rgba(255, 255, 255, 0.6)',
  imageBorder: 'rgba(255, 255, 255, 0.2)',
  text: '#211A15',
  textMuted: '#51443B',
  border: '#D6C7B7',
};

export const lightColors: ThemeColors = lightBase;

const darkBase: ThemeColors = {
  background: '#1A1410',
  surface: '#1A1410',
  surfaceContainerLow: '#231B15',
  surfaceContainer: '#2B221B',
  surfaceContainerHigh: '#362C24',
  surfaceVariant: '#51443B',
  onSurface: '#ECE0D7',
  onSurfaceVariant: '#D6C7B7',
  outline: '#9F8D80',
  outlineVariant: '#51443B',
  primary: '#FFB596',
  onPrimary: '#5F2200',
  primaryContainer: '#8A3300',
  onPrimaryContainer: '#FFDBCE',
  secondary: '#BAC3FF',
  onSecondary: '#232F61',
  secondaryContainer: '#3A4578',
  onSecondaryContainer: '#DFE0FF',
  gold: '#D4A017',
  goldSoft: '#FDE68A',
  goldContainer: '#3A2E10',
  onGold: '#FDF5DE',
  emerald: '#6EE7B7',
  error: '#F2B8B5',
  success: '#81C784',
  overlay: 'rgba(0, 0, 0, 0.5)',
  heroScrim: '31, 42, 92',
  blackScrim: '0, 0, 0',
  onImage: '#FFFFFF',
  onImageMuted: 'rgba(255, 255, 255, 0.8)',
  onImageFaint: 'rgba(255, 255, 255, 0.6)',
  imageBorder: 'rgba(255, 255, 255, 0.2)',
  text: '#ECE0D7',
  textMuted: '#D6C7B7',
  border: '#51443B',
};

export const darkColors: ThemeColors = darkBase;

export type Theme = {
  scheme: 'light' | 'dark';
  colors: ThemeColors;
  typography: Typography;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: typeof shadows;
  minTouchTarget: typeof minTouchTarget;
};

export const lightTheme: Theme = {
  scheme: 'light',
  colors: lightColors,
  typography,
  spacing,
  radii,
  shadows,
  minTouchTarget,
};

export const darkTheme: Theme = {
  scheme: 'dark',
  colors: darkColors,
  typography,
  spacing,
  radii,
  shadows,
  minTouchTarget,
};