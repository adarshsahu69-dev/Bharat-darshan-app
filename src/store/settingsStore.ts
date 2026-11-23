import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'light' | 'dark' | 'system';

export const DEFAULT_TRAVELERS = 2;
export const MIN_TRAVELERS = 1;
export const MAX_TRAVELERS = 10;

type SettingsState = {
  themePreference: ThemePreference;
  homeState: string | null;
  defaultTravelers: number;
  setThemePreference: (preference: ThemePreference) => void;
  setHomeState: (state: string | null) => void;
  setDefaultTravelers: (count: number) => void;
};

type PersistedSettings = Pick<
  SettingsState,
  'themePreference' | 'homeState' | 'defaultTravelers'
>;

function clampTravelers(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return DEFAULT_TRAVELERS;
  }
  return Math.min(MAX_TRAVELERS, Math.max(MIN_TRAVELERS, Math.round(value)));
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      homeState: null,
      defaultTravelers: DEFAULT_TRAVELERS,
      setThemePreference: (preference) => set({ themePreference: preference }),
      setHomeState: (homeState) => set({ homeState }),
      setDefaultTravelers: (count) =>
        set({ defaultTravelers: clampTravelers(count) }),
    }),
    {
      name: 'bharat-darshan-settings-v1',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persisted, version) => {
        const state = (persisted as Partial<PersistedSettings>) ?? {};
        const themePreference: ThemePreference =
          state.themePreference === 'light' ||
          state.themePreference === 'dark' ||
          state.themePreference === 'system'
            ? state.themePreference
            : 'system';
        if (version < 2) {
          return {
            themePreference,
            homeState: null,
            defaultTravelers: DEFAULT_TRAVELERS,
          } satisfies PersistedSettings;
        }
        return {
          themePreference,
          homeState:
            typeof state.homeState === 'string' && state.homeState.length > 0
              ? state.homeState
              : null,
          defaultTravelers: clampTravelers(state.defaultTravelers),
        } satisfies PersistedSettings;
      },
      partialize: (state) => ({
        themePreference: state.themePreference,
        homeState: state.homeState,
        defaultTravelers: state.defaultTravelers,
      }),
    },
  ),
);
