import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';
import {
  fetchMonument,
  fetchMonuments,
  monumentKeys,
  toMonument,
} from '@/data/monumentsApi';
import {
  allMonuments,
  filterMonumentList,
  Monument,
} from '@/data/monuments';

/**
 * All monuments, cached by React Query.
 *
 * No manual loading/caching/retry — React Query owns all of that. The component
 * just reads `data`, `isPending` and `isError` and renders accordingly.
 */
export function useMonuments() {
  return useQuery({
    queryKey: monumentKeys.all,
    queryFn: async () => {
      const rows = await fetchMonuments();
      return rows.map(toMonument) as Monument[];
    },
    // When the network request fails we fall back to the local seed data so
    // the app still shows something useful instead of an error screen.
    placeholderData: allMonuments,
  });
}

/**
 * A single monument by id. The detail cache is seeded from the list query when
 * available, so opening a details screen after browsing the list is instant.
 */
export function useMonument(id: string) {
  return useQuery({
    queryKey: monumentKeys.detail(id),
    queryFn: async () => {
      const row = await fetchMonument(id);
      if (!row) {
        return null;
      }
      return toMonument(row) as Monument;
    },
    enabled: Boolean(id),
    // Reuse the list cache when the row is already loaded.
    initialData: () => {
      const list = queryClient.getQueryData<Monument[]>(monumentKeys.all);
      if (!list || !id) {
        return undefined;
      }
      return list.find((m) => m.id === id);
    },
    // Seed fallback so a failed detail fetch still renders a real monument.
    placeholderData: allMonuments.find((m) => m.id === id),
  });
}

/**
 * Whether the currently shown data is the offline fallback rather than a fresh
 * Supabase fetch. Used to show a small "Showing saved data" label.
 */
export function useIsOfflineFallback() {
  const { isPending, isError, data } = useMonuments();
  return useMemo(
    () => ({
      isFallback: !isPending && isError && (data ?? []).length > 0,
    }),
    [isPending, isError, data],
  );
}

export { filterMonumentList, Monument };