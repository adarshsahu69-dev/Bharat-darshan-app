import { supabase } from '@/lib/supabase';

/**
 * Supabase row shape. Only the snake_case column names live here.
 *
 * The React Query hooks return the app's `Monument` type, not this shape, so
 * no other file has to know about the database column naming.
 */
export type MonumentRow = {
  id: string;
  name: string;
  state: string;
  city: string | null;
  category: string;
  categories: string[] | null;
  description: string | null;
  lat: number | null;
  lng: number | null;
  image_url: string | null;
  ticket_inr: number | null;
  timings: string | null;
  rating: number | null;
  review_count: string | null;
  is_unesco: boolean | null;
};

/** Query keys — keep them namespaced so cache invalidation is predictable. */
export const monumentKeys = {
  all: ['monuments'] as const,
  list: (filters?: { search?: string }) =>
    filters?.search
      ? [...monumentKeys.all, 'search', filters.search]
      : monumentKeys.all,
  detail: (id: string) => [...monumentKeys.all, 'detail', id] as const,
};

/**
 * ONE mapper. Converts a Supabase row into the app's Monument type. Column
 * names live only here; everything else reads the Monument shape.
 */
export function toMonument(row: MonumentRow) {
  return {
    id: row.id,
    name: row.name,
    state: row.state,
    city: row.city ?? '',
    category: row.category as 'Fort' | 'Temple' | 'Palace' | 'Museum' | 'Nature',
    categories: (row.categories ?? []) as (
      | 'forts'
      | 'temples'
      | 'palaces'
      | 'unesco'
      | 'museums'
      | 'nature'
    )[],
    image: row.image_url ?? '',
    rating: row.rating ?? 0,
    reviewCount: row.review_count ?? undefined,
    isUnesco: row.is_unesco ?? false,
    description: row.description ?? undefined,
    ticketPrice: row.ticket_inr ?? 0,
    timings: row.timings ?? undefined,
    lat: row.lat ?? 0,
    lng: row.lng ?? 0,
  };
}

/** Fetch every monument, ordered by name. */
export async function fetchMonuments(): Promise<MonumentRow[]> {
  const { data, error } = await supabase
    .from('monuments')
    .select('*')
    .order('name', { ascending: true });
  if (error) {
    throw error;
  }
  return (data ?? []) as MonumentRow[];
}

/** Fetch a single monument by id. */
export async function fetchMonument(id: string): Promise<MonumentRow | null> {
  const { data, error } = await supabase
    .from('monuments')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return data as MonumentRow | null;
}