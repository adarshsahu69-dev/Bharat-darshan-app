import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const DEFAULT_DISPLAY_NAME = 'Traveler';
export const MAX_DISPLAY_NAME_LENGTH = 30;

type ProfileState = {
  displayName: string;
  photoUri: string | null;
  setDisplayName: (name: string) => void;
  setPhotoUri: (uri: string | null) => void;
};

type PersistedProfileState = Pick<ProfileState, 'displayName' | 'photoUri'>;

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      displayName: DEFAULT_DISPLAY_NAME,
      photoUri: null,
      setDisplayName: (name) => {
        const trimmed = name.trim().slice(0, MAX_DISPLAY_NAME_LENGTH);
        set({
          displayName: trimmed.length > 0 ? trimmed : DEFAULT_DISPLAY_NAME,
        });
      },
      setPhotoUri: (uri) => set({ photoUri: uri }),
    }),
    {
      name: 'bharat-darshan-profile-v1',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persisted, version) => {
        const state = (persisted as Partial<PersistedProfileState>) ?? {};
        if (version < 2) {
          return {
            displayName:
              typeof state.displayName === 'string' && state.displayName.trim().length > 0
                ? state.displayName
                : DEFAULT_DISPLAY_NAME,
            photoUri: null,
          } satisfies PersistedProfileState;
        }
        return {
          displayName:
            typeof state.displayName === 'string' && state.displayName.trim().length > 0
              ? state.displayName
              : DEFAULT_DISPLAY_NAME,
          photoUri: typeof state.photoUri === 'string' ? state.photoUri : null,
        } satisfies PersistedProfileState;
      },
      partialize: (state) => ({
        displayName: state.displayName,
        photoUri: state.photoUri,
      }),
    },
  ),
);

/** Returns up to two uppercase initials from a display name. */
export function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) {
    return 'T';
  }
  const first = parts[0][0] ?? '';
  const second = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
  const initials = `${first}${second}`.toUpperCase();
  return initials || 'T';
}
