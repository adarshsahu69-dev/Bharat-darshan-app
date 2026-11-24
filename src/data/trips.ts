/**
 * Trip data model for the Trips screen.
 *
 * The trip itself is persisted in the Zustand store (src/store/tripStore.ts).
 * This module owns the TypeScript shapes, the formatting helpers and the seed
 * itinerary that the store is initialised with.
 *
 * Stops are snapshots: they carry everything a TripStopCard needs (name, image,
 * rating, ticket price, coordinates) plus the `monumentId` they came from so a
 * stop can be linked back to its details screen.
 */

import { allMonuments, getMonument, Monument } from '@/data/monuments';

export type BudgetCategoryId = 'tickets' | 'travel' | 'guides' | 'food';

export type BudgetColor = 'primary' | 'gold' | 'emerald' | 'secondary';

export type TripBudgetCategory = {
  id: BudgetCategoryId;
  label: string;
  /** Allocated amount in rupees. */
  amount: number;
  /** Portion already pre-paid, in rupees (0..amount). */
  prepaid: number;
  color: BudgetColor;
};

export type TripStop = {
  id: string;
  /** Monument this stop was created from, when it came from the catalogue. */
  monumentId?: string;
  name: string;
  time: string;
  duration: string;
  rating: number;
  reviewCount: string;
  description: string;
  image: string;
  ticketPrice: number;
  ticketLabel: string;
  lat: number;
  lng: number;
};

export type TripDay = {
  id: string;
  title: string;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  stops: TripStop[];
};

export type Trip = {
  title: string;
  destination: string;
  /** ISO dates. */
  startDate: string;
  endDate: string;
  travelerCount: number;
  /** Overall pre-paid amount in rupees. */
  prepaid: number;
  categories: TripBudgetCategory[];
  days: TripDay[];
};

export type TripTraveler = {
  id: string;
  name: string;
  image: string;
};

/** Small, reliable avatar photos for the traveler row. */
export const tripTravelerImages = [
  'https://i.pravatar.cc/100?img=12',
  'https://i.pravatar.cc/100?img=5',
  'https://i.pravatar.cc/100?img=9',
  'https://i.pravatar.cc/100?img=32',
];

/* ------------------------------------------------------------------ helpers */

const RUPEE = '₹';

/** Indian digit grouping, e.g. 1400000 -> "14,00,000". */
export function groupIndianDigits(value: number): string {
  const digits = String(Math.max(0, Math.round(value)));
  if (digits.length <= 3) {
    return digits;
  }
  const lastThree = digits.slice(-3);
  let rest = digits.slice(0, -3);
  const groups: string[] = [];
  while (rest.length > 2) {
    groups.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest.length > 0) {
    groups.unshift(rest);
  }
  return `${groups.join(',')},${lastThree}`;
}

/** Format rupees with the ₹ symbol and Indian grouping. */
export function formatINR(value: number): string {
  return `${RUPEE}${groupIndianDigits(value)}`;
}

/** Compact label for tight spaces, e.g. 2100 -> "₹2.1k". */
export function formatINRCompact(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    const label = Number.isInteger(k) ? String(k) : k.toFixed(1);
    return `${RUPEE}${label}k`;
  }
  return `${RUPEE}${Math.round(value)}`;
}

/** Great-circle distance in kilometres between two coordinates. */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Travel distance for a day: sum of the legs between consecutive stops. */
export function dayTravelKm(day: TripDay): number {
  let total = 0;
  for (let i = 1; i < day.stops.length; i += 1) {
    total += haversineKm(day.stops[i - 1], day.stops[i]);
  }
  return Math.round(total);
}

export function dayMetaLabel(day: TripDay): string {
  const count = day.stops.length;
  const km = dayTravelKm(day);
  const places = `${count} ${count === 1 ? 'place' : 'places'}`;
  return `${places} · ${km} km total travel`;
}

export function tripSitesCount(trip: Trip): number {
  return trip.days.reduce((sum, day) => sum + day.stops.length, 0);
}

export function tripUnescoCount(trip: Trip): number {
  let count = 0;
  for (const day of trip.days) {
    for (const stop of day.stops) {
      const monument = stop.monumentId ? getMonument(stop.monumentId) : undefined;
      if (monument?.isUnesco) {
        count += 1;
      }
    }
  }
  return count;
}



const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function shortMonth(date: Date): string {
  return SHORT_MONTHS[date.getMonth()];
}

/** "3 Days · 24 – 26 Oct 2026" style label from ISO dates. */
export function formatTripDates(startDate: string, endDate: string): string {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Dates to be decided';
  }
  const dayCount = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1,
  );
  const dayLabel = `${dayCount} ${dayCount === 1 ? 'Day' : 'Days'}`;

  const startDayMonth = `${start.getDate()} ${shortMonth(start)}`;
  const endDayMonth = `${end.getDate()} ${shortMonth(end)}`;

  if (start.getFullYear() !== end.getFullYear()) {
    return `${dayLabel} · ${startDayMonth} ${start.getFullYear()} – ${endDayMonth} ${end.getFullYear()}`;
  }

  if (start.getMonth() === end.getMonth()) {
    return `${dayLabel} · ${start.getDate()} – ${end.getDate()} ${shortMonth(end)} ${end.getFullYear()}`;
  }

  return `${dayLabel} · ${startDayMonth} – ${endDayMonth} ${end.getFullYear()}`;
}

/** Human-friendly label for an ISO date on a day chip, e.g. "24 Oct". */
export function formatDayDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return `${date.getDate()} ${shortMonth(date)}`;
}

/* --------------------------------------------------------------- stop build */

const STOP_TIMES = [
  '08:30 AM',
  '11:00 AM',
  '02:00 PM',
  '04:30 PM',
  '06:30 PM',
  '08:00 PM',
];

/** Build a fully-populated stop from a catalogue monument. */
export function stopFromMonument(monument: Monument, index = 0): TripStop {
  return {
    id: `${monument.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    monumentId: monument.id,
    name: monument.name,
    time: STOP_TIMES[index % STOP_TIMES.length],
    duration: '2 hrs',
    rating: monument.rating,
    reviewCount: monument.reviewCount ?? '',
    description: monument.description ?? '',
    image: monument.image,
    ticketPrice: monument.ticketPrice,
    ticketLabel:
      monument.ticketLabel ??
      (monument.ticketPrice > 0 ? `${RUPEE}${monument.ticketPrice}` : 'Free'),
    lat: monument.lat,
    lng: monument.lng,
  };
}

/* --------------------------------------------------------------- seed trip */

type DayBlueprint = {
  id: string;
  title: string;
  date: string;
  monumentIds: string[];
};

const DAY_BLUEPRINTS: DayBlueprint[] = [
  {
    id: 'day-1',
    title: 'Amber & Forts',
    date: '2026-12-12',
    monumentIds: ['amber-fort', 'jaigarh-fort', 'nahargarh-fort', 'jal-mahal'],
  },
  {
    id: 'day-2',
    title: 'Old Pink City',
    date: '2026-12-13',
    monumentIds: ['hawa-mahal', 'city-palace-jaipur', 'albert-hall'],
  },
  {
    id: 'day-3',
    title: 'Sunset & Farewell',
    date: '2026-12-14',
    monumentIds: ['nahargarh-fort', 'jal-mahal'],
  },
];

function seedStops(day: DayBlueprint): TripStop[] {
  return day.monumentIds
    .map((monumentId, index) => {
      const monument = getMonument(monumentId);
      if (!monument) {
        return null;
      }
      const stop = stopFromMonument(monument, index);
      return { ...stop, id: `${day.id}-${monumentId}` };
    })
    .filter((stop): stop is TripStop => stop !== null);
}

/** Build the default trip the store hydrates with. */
export function createSeedTrip(): Trip {
  const days: TripDay[] = DAY_BLUEPRINTS.map((blueprint) => ({
    id: blueprint.id,
    title: blueprint.title,
    date: blueprint.date,
    stops: seedStops(blueprint),
  }));

  const categories: TripBudgetCategory[] = [
    { id: 'tickets', label: 'Tickets', amount: 0, prepaid: 0, color: 'primary' },
    { id: 'travel', label: 'Travel', amount: 4200, prepaid: 0, color: 'gold' },
    { id: 'guides', label: 'Guides', amount: 3500, prepaid: 0, color: 'emerald' },
    { id: 'food', label: 'Food', amount: 5000, prepaid: 0, color: 'secondary' },
  ];

  return {
    title: 'Royal Heritage of Rajasthan',
    destination: 'Jaipur & Amer',
    startDate: '2026-12-12',
    endDate: '2026-12-14',
    travelerCount: 4,
    prepaid: 6000,
    categories,
    days,
  };
}

/** All catalogue monuments, handy for the place picker. */
export const tripPickerMonuments: Monument[] = allMonuments;

/* ------------------------------------------------- legacy compatibility ---- */

/** @deprecated Use the store instead. Kept so older imports still resolve. */
export const tripHeader = {
  chip: 'Rajasthan Circuit',
  title: 'Royal Heritage of Rajasthan',
  subtitle: 'Jaipur & Amer',
  dates: '3 Days · 12 – 14 Dec 2026',
  confirmed: 'Confirmed Trip',
  travelerCount: 4,
};