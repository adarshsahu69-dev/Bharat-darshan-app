/**
 * Bharat Darshan design tokens.
 * Single source of truth for colours, typography, spacing, radii and shadows.
 * Never hard-code a colour, font size or font family in a component.
 */

export const palette = {
  terracotta: '#B34A12',
  terracottaDeep: '#8F3A0E',
  royalIndigo: '#1F2A5C',
  sandstone: '#FBF4E9',
  gold: '#D4A017',
} as const;

const sharedTypography = {
  display: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 32,
    lineHeight: 40,
  },
  headline: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 26,
    lineHeight: 34,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
} as const;

export type Typography = typeof sharedTypography;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  page: 16,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  card: 18,
  hero: 28,
  sheet: 28,
  chip: 999,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 1,
  },
} as const;

export const minTouchTarget = 44;

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryPressed: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  gold: string;
  overlay: string;
  error: string;
  success: string;
};

export const lightColors: ThemeColors = {
  background: '#FFFDF9',
  surface: palette.sandstone,
  surfaceAlt: '#F4EAD9',
  text: '#2B1D12',
  textMuted: '#6B5B4B',
  border: '#E8DAC6',
  primary: palette.terracotta,
  primaryPressed: palette.terracottaDeep,
  onPrimary: '#FFFFFF',
  secondary: palette.royalIndigo,
  onSecondary: '#FFFFFF',
  gold: palette.gold,
  overlay: 'rgba(31, 42, 92, 0.32)',
  error: '#B3261E',
  success: '#2E7D32',
};

export const darkColors: ThemeColors = {
  background: '#14100C',
  surface: '#1F1913',
  surfaceAlt: '#2A231A',
  text: '#F7EDE0',
  textMuted: '#B8A791',
  border: '#3A3025',
  primary: '#E07A3F',
  primaryPressed: '#B34A12',
  onPrimary: '#1A120B',
  secondary: '#AEB9EA',
  onSecondary: '#14100C',
  gold: '#E5B93C',
  overlay: 'rgba(0, 0, 0, 0.5)',
  error: '#F2B8B5',
  success: '#81C784',
};

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
  typography: sharedTypography,
  spacing,
  radii,
  shadows,
  minTouchTarget,
};

export const darkTheme: Theme = {
  scheme: 'dark',
  colors: darkColors,
  typography: sharedTypography,
  spacing,
  radii,
  shadows,
  minTouchTarget,
};