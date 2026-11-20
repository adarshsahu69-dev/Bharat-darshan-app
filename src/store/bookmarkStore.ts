import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type BookmarkState = {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  removeSaved: (id: string) => void;
  clearSaved: () => void;
};

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set) => ({
      savedIds: [],
      toggleSaved: (id) =>
        set((state) => {
          const exists = state.savedIds.includes(id);
          return {
            savedIds: exists
              ? state.savedIds.filter((savedId) => savedId !== id)
              : [...state.savedIds, id],
          };
        }),
      removeSaved: (id) =>
        set((state) => ({
          savedIds: state.savedIds.filter((savedId) => savedId !== id),
        })),
      clearSaved: () => set({ savedIds: [] }),
    }),
    {
      name: 'bharat-darshan-saved-v1',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (state) => ({ savedIds: state.savedIds }),
    },
  ),
);

export const selectIsSaved = (id: string) => (state: BookmarkState) =>
  state.savedIds.includes(id);
