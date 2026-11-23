import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'light' | 'dark' | 'system';

type SettingsState = {
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      setThemePreference: (preference) => set({ themePreference: preference }),
    }),
    {
      name: 'bharat-darshan-settings-v1',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (state) => ({ themePreference: state.themePreference }),
    },
  ),
);
