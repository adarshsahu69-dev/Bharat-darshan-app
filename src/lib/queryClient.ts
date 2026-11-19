import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client.
 *
 * One shared QueryClient is created here and wrapped around the app in
 * app/_layout.tsx. It owns all caching, background refetch and retry so the
 * data hooks do not have to.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale for 5 minutes; the Supabase policy is read-only so stale data is
      // safe to show while a background refresh happens.
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});