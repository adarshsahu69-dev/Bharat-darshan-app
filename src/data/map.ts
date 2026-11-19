/**
 * Heritage Map data.
 *
 * Builders derive pins, category counts and previews from a monument list so the
 * map stays in sync with Supabase-fetched data (or seed data as fallback).
 */

import { allMonuments, CategoryId, Monument } from '@/data/monuments';

export type MapCategoryId = 'all' | CategoryId;

export type MapCategory = {
  id: MapCategoryId;
  label: string;
  /** Short label shown on the chip. */
  chipLabel: string;
  count: number;
  icon:
    | 'explore'
    | 'castle'
    | 'temple-hindu'
    | 'account-balance'
    | 'verified'
    | 'museum'
    | 'forest';
};

/** Default camera focused on Jaipur / Amer. */
export const mapInitialRegion = {
  latitude: 26.92,
  longitude: 75.82,
  latitudeDelta: 0.25,
  longitudeDelta: 0.25,
};

export const mapSearchPlaceholder = 'Search monuments, cities, or landmarks';

function countIn(monuments: Monument[], id: MapCategoryId): number {
  if (id === 'all') {
    return monuments.length;
  }
  if (id === 'unesco') {
    return monuments.filter((monument) => monument.isUnesco).length;
  }
  return monuments.filter((monument) =>
    monument.categories.includes(id as CategoryId),
  ).length;
}

/** Build category chips with counts derived from the given monument list. */
export function buildMapCategories(monuments: Monument[]): MapCategory[] {
  return [
    {
      id: 'all',
      label: 'All Sites',
      chipLabel: 'All Sites',
      count: countIn(monuments, 'all'),
      icon: 'explore',
    },
    {
      id: 'forts',
      label: 'Forts',
      chipLabel: 'Forts',
      count: countIn(monuments, 'forts'),
      icon: 'castle',
    },
    {
      id: 'temples',
      label: 'Temples',
      chipLabel: 'Temples',
      count: countIn(monuments, 'temples'),
      icon: 'temple-hindu',
    },
    {
      id: 'palaces',
      label: 'Palaces',
      chipLabel: 'Palaces',
      count: countIn(monuments, 'palaces'),
      icon: 'account-balance',
    },
    {
      id: 'unesco',
      label: 'UNESCO',
      chipLabel: 'UNESCO',
      count: countIn(monuments, 'unesco'),
      icon: 'verified',
    },
    {
      id: 'museums',
      label: 'Museums',
      chipLabel: 'Museums',
      count: countIn(monuments, 'museums'),
      icon: 'museum',
    },
    {
      id: 'nature',
      label: 'Nature',
      chipLabel: 'Nature',
      count: countIn(monuments, 'nature'),
      icon: 'forest',
    },
  ];
}

export type MapPin = {
  id: string;
  /** Monument id used to open the details screen. */
  monumentId: string;
  name: string;
  category: Exclude<MapCategoryId, 'all'>;
  latitude: number;
  longitude: number;
  /** Small marker, used for non-selected pins. */
  isPrimary?: boolean;
  image: string;
  ticketPrice: number;
  isUnesco: boolean;
  rating: number;
  city: string;
  state: string;
};

/**
 * Primary category per monument. A monument belongs to several categories, but
 * it needs one marker colour; pick the first matching non-UNESCO tag.
 */
function primaryMapCategory(monument: Monument): Exclude<MapCategoryId, 'all'> {
  const preferred = monument.categories.find((id) => id !== 'unesco');
  if (preferred) {
    return preferred;
  }
  if (monument.isUnesco) {
    return 'unesco';
  }
  return 'forts';
}

/** Build map pins from the given monument list. */
export function buildMapPins(monuments: Monument[]): MapPin[] {
  return monuments
    .filter(
      (monument) =>
        typeof monument.lat === 'number' && typeof monument.lng === 'number',
    )
    .map((monument, index) => ({
      id: monument.id,
      monumentId: monument.id,
      name: monument.name,
      category: primaryMapCategory(monument),
      latitude: monument.lat,
      longitude: monument.lng,
      isPrimary: index === 0,
      image: monument.image,
      ticketPrice: monument.ticketPrice,
      isUnesco: Boolean(monument.isUnesco),
      rating: monument.rating,
      city: monument.city,
      state: monument.state,
    }));
}

export type MapPreview = {
  monumentId: string;
  name: string;
  location: string;
  distanceLabel: string;
  priceLabel: string;
  image: string;
  rating: number;
  isUnesco: boolean;
};

export function previewFromMonument(monument: Monument): MapPreview {
  return {
    monumentId: monument.id,
    name: monument.name,
    location: `${monument.city}, ${monument.state}`,
    distanceLabel:
      monument.distanceKm !== undefined
        ? `${monument.distanceKm} km away`
        : monument.state,
    priceLabel:
      monument.ticketPrice > 0
        ? `₹${monument.ticketPrice} Entry`
        : 'Free Entry',
    image: monument.image,
    rating: monument.rating,
    isUnesco: Boolean(monument.isUnesco),
  };
}

/** Build a preview lookup and a sensible default from the given monuments. */
export function buildMapPreviews(monuments: Monument[]): {
  previewByMonument: Record<string, MapPreview>;
  defaultPreview: MapPreview | null;
} {
  const previewByMonument = Object.fromEntries(
    monuments.map((monument) => [monument.id, previewFromMonument(monument)]),
  );
  const defaultMonument =
    monuments.find((monument) => monument.id === 'amber-fort') ?? monuments[0];
  return {
    previewByMonument,
    defaultPreview: defaultMonument
      ? previewFromMonument(defaultMonument)
      : null,
  };
}

// Seed-derived defaults kept for compatibility with static consumers.
export const mapCategories: MapCategory[] = buildMapCategories(allMonuments);
export const mapPins: MapPin[] = buildMapPins(allMonuments);
export const { previewByMonument: mapPreviewByMonument, defaultPreview } = (() => {
  const built = buildMapPreviews(allMonuments);
  return {
    previewByMonument: built.previewByMonument,
    // Seed list is never empty, but satisfy the type for the exported constant.
    defaultPreview: built.defaultPreview as MapPreview,
  };
})();