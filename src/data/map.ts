/**
 * Heritage Map data.
 *
 * Pins are derived from the shared monument list so the map, Home and Explore
 * always agree. Category counts are computed from real data.
 */

import {
  allMonuments,
  CategoryId,
  Monument,
} from '@/data/monuments';

export type MapCategoryId = 'all' | CategoryId;

export type MapCategory = {
  id: MapCategoryId;
  label: string;
  /** Short label shown on the chip. */
  chipLabel: string;
  count: number;
  icon: 'explore' | 'castle' | 'temple-hindu' | 'account-balance' | 'verified' | 'museum' | 'forest';
};

/** Default camera showing the whole country so every pin is visible. */
export const mapInitialRegion = {
  latitude: 22.5,
  longitude: 79.0,
  latitudeDelta: 20,
  longitudeDelta: 20,
};

export const mapSearchPlaceholder = 'Search monuments, cities, or landmarks';

const countIn = (id: MapCategoryId): number => {
  if (id === 'all') {
    return allMonuments.length;
  }
  if (id === 'unesco') {
    return allMonuments.filter((monument) => monument.isUnesco).length;
  }
  return allMonuments.filter((monument) =>
    monument.categories.includes(id as CategoryId),
  ).length;
};

export const mapCategories: MapCategory[] = [
  { id: 'all', label: 'All Sites', chipLabel: 'All Sites', count: countIn('all'), icon: 'explore' },
  { id: 'forts', label: 'Forts', chipLabel: 'Forts', count: countIn('forts'), icon: 'castle' },
  { id: 'temples', label: 'Temples', chipLabel: 'Temples', count: countIn('temples'), icon: 'temple-hindu' },
  { id: 'palaces', label: 'Palaces', chipLabel: 'Palaces', count: countIn('palaces'), icon: 'account-balance' },
  { id: 'unesco', label: 'UNESCO', chipLabel: 'UNESCO', count: countIn('unesco'), icon: 'verified' },
  { id: 'museums', label: 'Museums', chipLabel: 'Museums', count: countIn('museums'), icon: 'museum' },
  { id: 'nature', label: 'Nature', chipLabel: 'Nature', count: countIn('nature'), icon: 'forest' },
];

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
 * it needs one marker colour; pick the first matching non-nature tag.
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

export const mapPins: MapPin[] = allMonuments.map((monument, index) => ({
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

export const mapPreviewByMonument: Record<string, MapPreview> =
  Object.fromEntries(
    allMonuments.map((monument) => [monument.id, previewFromMonument(monument)]),
  );

export const defaultPreview: MapPreview = previewFromMonument(
  allMonuments.find((monument) => monument.id === 'amber-fort') ?? allMonuments[0],
);