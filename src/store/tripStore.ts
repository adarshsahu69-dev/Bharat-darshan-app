/**
 * Persistent trip store (Zustand + AsyncStorage).
 *
 * Holds the editable trip: header details, budget categories, and per-day stops.
 * Every mutation is immutable so React re-renders and the persisted snapshot
 * stays consistent.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getMonument } from '@/data/monuments';
import {
  BudgetCategoryId,
  createSeedTrip,
  stopFromMonument,
  Trip,
  TripBudgetCategory,
  TripDay,
  TripStop,
} from '@/data/trips';
import { useSettingsStore } from '@/store/settingsStore';

function clamp(value: number, min: number, max = Number.MAX_SAFE_INTEGER) {
  return Math.min(max, Math.max(min, value));
}

function toAmount(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

function nextDayDate(days: TripDay[]): string {
  const last = days[days.length - 1];
  if (!last) {
    return new Date().toISOString().slice(0, 10);
  }
  const date = new Date(`${last.date}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return last.date;
  }
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function sanitizeCategory(category: unknown): TripBudgetCategory | null {
  if (!category || typeof category !== 'object') return null;
  const c = category as Record<string, unknown>;
  const id = c.id;
  if (id !== 'tickets' && id !== 'travel' && id !== 'guides' && id !== 'food') {
    return null;
  }
  const label =
    typeof c.label === 'string'
      ? c.label
      : id.charAt(0).toUpperCase() + id.slice(1);
  const color =
    c.color === 'primary' ||
    c.color === 'gold' ||
    c.color === 'emerald' ||
    c.color === 'secondary'
      ? c.color
      : id === 'tickets'
        ? 'primary'
        : id === 'travel'
          ? 'gold'
          : id === 'guides'
            ? 'emerald'
            : 'secondary';
  return {
    id,
    label,
    amount: toAmount(c.amount),
    prepaid: 0,
    color,
  };
}

function sanitizeTrip(raw: unknown): Trip {
  const seed = createSeedTrip();
  if (!raw || typeof raw !== 'object') return seed;
  const t = raw as Record<string, unknown>;

  const daysRaw = Array.isArray(t.days) ? t.days : seed.days;
  const days: TripDay[] = daysRaw
    .map((d) => {
      if (!d || typeof d !== 'object') return null;
      const day = d as Record<string, unknown>;
      const stopsRaw = Array.isArray(day.stops) ? day.stops : [];
      const stops: TripStop[] = stopsRaw
        .map((s) => {
          if (!s || typeof s !== 'object') return null;
          const stop = s as Record<string, unknown>;
          if (typeof stop.id !== 'string' || typeof stop.name !== 'string') return null;
          return {
            id: stop.id,
            monumentId: typeof stop.monumentId === 'string' ? stop.monumentId : undefined,
            name: stop.name,
            time: typeof stop.time === 'string' ? stop.time : '',
            duration: typeof stop.duration === 'string' ? stop.duration : '',
            rating: toAmount(stop.rating),
            reviewCount: typeof stop.reviewCount === 'string' ? stop.reviewCount : '',
            description: typeof stop.description === 'string' ? stop.description : '',
            image: typeof stop.image === 'string' ? stop.image : '',
            ticketPrice: toAmount(stop.ticketPrice),
            ticketLabel: typeof stop.ticketLabel === 'string' ? stop.ticketLabel : '₹0',
            lat: typeof stop.lat === 'number' && Number.isFinite(stop.lat) ? stop.lat : 0,
            lng: typeof stop.lng === 'number' && Number.isFinite(stop.lng) ? stop.lng : 0,
          } as TripStop;
        })
        .filter((s): s is TripStop => s !== null);
      return {
        id: typeof day.id === 'string' ? day.id : makeId('day'),
        title: typeof day.title === 'string' ? day.title : 'Day',
        date: typeof day.date === 'string' ? day.date : new Date().toISOString().slice(0, 10),
        stops,
      } as TripDay;
    })
    .filter((d): d is TripDay => d !== null);

  const categoriesRaw = Array.isArray(t.categories) ? t.categories : seed.categories;
  const categories = categoriesRaw
    .map(sanitizeCategory)
    .filter((c): c is TripBudgetCategory => c !== null);
  const byId = new Map(categories.map((c) => [c.id, c]));
  for (const sc of seed.categories) {
    if (!byId.has(sc.id)) byId.set(sc.id, sc);
  }
  // tickets amount is derived; keep 0
  const normalizedCategories = (['tickets', 'travel', 'guides', 'food'] as BudgetCategoryId[]).map(
    (id) => {
      const c = byId.get(id)!;
      return { ...c, id, amount: id === 'tickets' ? 0 : toAmount(c.amount), prepaid: 0 };
    },
  );

  const oldCategoryPrepaid = Array.isArray(t.categories)
    ? t.categories.reduce((sum, c) => {
        if (!c || typeof c !== 'object') return sum;
        const cat = c as Record<string, unknown>;
        return sum + toAmount(cat.prepaid);
      }, 0)
    : 0;
  const prepaid =
    t.prepaid !== undefined ? toAmount(t.prepaid) : oldCategoryPrepaid;

  return {
    title: typeof t.title === 'string' ? t.title : seed.title,
    destination: typeof t.destination === 'string' ? t.destination : seed.destination,
    startDate: typeof t.startDate === 'string' ? t.startDate : seed.startDate,
    endDate: typeof t.endDate === 'string' ? t.endDate : seed.endDate,
    travelerCount: Math.max(1, toAmount(t.travelerCount) || seed.travelerCount),
    prepaid,
    categories: normalizedCategories,
    days: days.length > 0 ? days : seed.days,
  };
}

export type TripStore = {
  trip: Trip;
  setCategoryAmount: (id: BudgetCategoryId, value: number) => void;
  setPrepaid: (value: number) => void;
  setTripTitle: (title: string) => void;
  setTripDestination: (destination: string) => void;
  setTripDates: (startDate: string, endDate: string) => void;
  setTravelerCount: (count: number) => void;
  addDay: (name?: string) => string;
  renameDay: (dayId: string, name: string) => void;
  removeDay: (dayId: string) => void;
  addStopToDay: (dayId: string, monumentId: string) => void;
  removeStop: (dayId: string, stopId: string) => void;
  moveStop: (dayId: string, stopId: string, direction: -1 | 1) => void;
  resetTrip: () => void;
};

export const useTripStore = create<TripStore>()(
  persist(
    (set, get) => ({
      trip: createSeedTrip(),

      setCategoryAmount: (id, value) =>
        set((state) => ({
          trip: {
            ...state.trip,
            categories: state.trip.categories.map((category) => {
              if (category.id !== id || id === 'tickets') return category;
              return { ...category, amount: toAmount(value), prepaid: 0 };
            }),
          },
        })),

      setPrepaid: (value) =>
        set((state) => ({
          trip: { ...state.trip, prepaid: toAmount(value) },
        })),

      setTripTitle: (title) =>
        set((state) => ({ trip: { ...state.trip, title } })),

      setTripDestination: (destination) =>
        set((state) => ({ trip: { ...state.trip, destination } })),

      setTripDates: (startDate, endDate) => {
        const safeEnd = endDate < startDate ? startDate : endDate;
        set((state) => ({
          trip: { ...state.trip, startDate, endDate: safeEnd },
        }));
      },

      setTravelerCount: (count) =>
        set((state) => ({
          trip: {
            ...state.trip,
            travelerCount: Math.max(1, Math.round(toAmount(count) || 1)),
          },
        })),

      addDay: (name) => {
        const dayId = makeId('day');
        set((state) => {
          const nextNumber = state.trip.days.length + 1;
          const trimmed = name?.trim() ?? '';
          const day: TripDay = {
            id: dayId,
            title: trimmed.length > 0 ? trimmed : `Day ${nextNumber}`,
            date: nextDayDate(state.trip.days),
            stops: [],
          };
          return { trip: { ...state.trip, days: [...state.trip.days, day] } };
        });
        return dayId;
      },

      renameDay: (dayId, name) =>
        set((state) => {
          const index = state.trip.days.findIndex((day) => day.id === dayId);
          if (index < 0) return state;
          const trimmed = name.trim();
          const title = trimmed.length > 0 ? trimmed : `Day ${index + 1}`;
          const days = state.trip.days.map((day) =>
            day.id === dayId ? { ...day, title } : day,
          );
          return { trip: { ...state.trip, days } };
        }),

      removeDay: (dayId) =>
        set((state) => {
          if (state.trip.days.length <= 1) return state;
          const days = state.trip.days.filter((day) => day.id !== dayId);
          return { trip: { ...state.trip, days } };
        }),

      addStopToDay: (dayId, monumentId) => {
        const monument = getMonument(monumentId);
        if (!monument) return;
        const stop: TripStop = stopFromMonument(monument);
        set((state) => {
          const days = state.trip.days.map((day) =>
            day.id === dayId ? { ...day, stops: [...day.stops, stop] } : day,
          );
          return { trip: { ...state.trip, days } };
        });
      },

      removeStop: (dayId, stopId) =>
        set((state) => {
          const days = state.trip.days.map((day) => {
            if (day.id !== dayId) return day;
            return {
              ...day,
              stops: day.stops.filter((item) => item.id !== stopId),
            };
          });
          return { trip: { ...state.trip, days } };
        }),

      moveStop: (dayId, stopId, direction) =>
        set((state) => {
          const days = state.trip.days.map((day) => {
            if (day.id !== dayId) return day;
            const index = day.stops.findIndex((stop) => stop.id === stopId);
            if (index < 0) return day;
            const target = index + direction;
            if (target < 0 || target >= day.stops.length) return day;
            const stops = [...day.stops];
            const [moved] = stops.splice(index, 1);
            stops.splice(target, 0, moved);
            return { ...day, stops };
          });
          return { trip: { ...state.trip, days } };
        }),

      resetTrip: () => {
        const defaultTravelers = useSettingsStore.getState().defaultTravelers;
        const trip = createSeedTrip();
        set({ trip: { ...trip, travelerCount: defaultTravelers } });
      },
    }),
    {
      name: 'bharat-darshan-trip-v1',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persisted, version) => {
        const state = (persisted as { trip?: unknown }) ?? {};
        if (version < 2) {
          return { trip: sanitizeTrip(state.trip) };
        }
        return { trip: sanitizeTrip(state.trip) };
      },
      partialize: (state) => ({ trip: state.trip }),
    },
  ),
);

export const selectTrip = (state: TripStore) => state.trip;
