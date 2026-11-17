import { Theme } from '@/theme';

/**
 * App-wide status-bar style derived from the active theme.
 */
export function statusBarStyle(theme: Theme): 'light' | 'dark' {
  return theme.scheme === 'dark' ? 'light' : 'dark';
}