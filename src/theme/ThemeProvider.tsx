import { createContext, ReactNode, useContext } from 'react';
import { useColorScheme } from 'react-native';

import { useSettingsStore } from '@/store/settingsStore';
import { darkTheme, lightTheme, Theme } from './index';

const ThemeContext = createContext<Theme>(lightTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const themePreference = useSettingsStore((state) => state.themePreference);

  const scheme =
    themePreference === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : themePreference;
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}