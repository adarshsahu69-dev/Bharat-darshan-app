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

const MAX_TICKET_FLOOR = 0;

function clamp(value: number, min: number, max = Number.MAX_SAFE_INTEGER) {
  return Math.min(max, Math.max(min, value));
}

function toAmount(value: number): number {
  if (!Number.isFinite(value)) {
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

/** Subtract a stop's ticket price from the Tickets category, floored at 0. */
function adjustTickets(
  categories: TripBudgetCategory[],
  delta: number,
): TripBudgetCategory[] {
  return categories.map((category) => {
    if (category.id !== 'tickets') {
      return category;
    }
    const amount = clamp(
      category.amount + delta,
      MAX_TICKET_FLOOR,
    );
    return {
      ...category,
      amount,
      prepaid: clamp(category.prepaid, 0, amount),
    };
  });
}

export type TripStore = {
  trip: Trip;

  setTotalBudget: (value: number) => void;
  setCategoryAmount: (id: BudgetCategoryId, value: number) => void;
  setCategoryPrepaid: (id: BudgetCategoryId, value: number) => void;
  toggleCategoryPrepaid: (id: BudgetCategoryId) => void;

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

      setTotalBudget: (value) =>
        set((state) => ({
          trip: { ...state.trip, totalBudget: toAmount(value) },
        })),

      setCategoryAmount: (id, value) =>
        set((state) => ({
          trip: {
            ...state.trip,
            categories: state.trip.categories.map((category) => {
              if (category.id !== id) {
                return category;
              }
              const amount = toAmount(value);
              return {
                ...category,
                amount,
                prepaid: clamp(category.prepaid, 0, amount),
              };
            }),
          },
        })),

      setCategoryPrepaid: (id, value) =>
        set((state) => ({
          trip: {
            ...state.trip,
            categories: state.trip.categories.map((category) => {
              if (category.id !== id) {
                return category;
              }
              return {
                ...category,
                prepaid: clamp(toAmount(value), 0, category.amount),
              };
            }),
          },
        })),

      toggleCategoryPrepaid: (id) =>
        set((state) => ({
          trip: {
            ...state.trip,
            categories: state.trip.categories.map((category) => {
              if (category.id !== id) {
                return category;
              }
              const isPrepaid = category.prepaid >= category.amount;
              return {
                ...category,
                prepaid: isPrepaid ? 0 : category.amount,
              };
            }),
          },
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
            travelerCount: clamp(Math.round(count), 1),
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
          return {
            trip: { ...state.trip, days: [...state.trip.days, day] },
          };
        });
        return dayId;
      },

      renameDay: (dayId, name) =>
        set((state) => {
          const index = state.trip.days.findIndex((day) => day.id === dayId);
          if (index < 0) {
            return state;
          }
          const trimmed = name.trim();
          const title = trimmed.length > 0 ? trimmed : `Day ${index + 1}`;
          const days = state.trip.days.map((day) =>
            day.id === dayId ? { ...day, title } : day,
          );
          return { trip: { ...state.trip, days } };
        }),

      removeDay: (dayId) =>
        set((state) => {
          if (state.trip.days.length <= 1) {
            return state;
          }
          const days = state.trip.days.filter((day) => day.id !== dayId);
          return { trip: { ...state.trip, days } };
        }),

      addStopToDay: (dayId, monumentId) => {
        const monument = getMonument(monumentId);
        if (!monument) {
          return;
        }
        const stop: TripStop = stopFromMonument(monument);
        set((state) => {
          const days = state.trip.days.map((day) =>
            day.id === dayId
              ? { ...day, stops: [...day.stops, stop] }
              : day,
          );
          const categories = adjustTickets(
            state.trip.categories,
            stop.ticketPrice,
          );
          return { trip: { ...state.trip, days, categories } };
        });
      },

      removeStop: (dayId, stopId) => {
        const stop = get()
          .trip.days.find((day) => day.id === dayId)
          ?.stops.find((item) => item.id === stopId);
        set((state) => {
          const days = state.trip.days.map((day) => {
            if (day.id !== dayId) {
              return day;
            }
            return {
              ...day,
              stops: day.stops.filter((item) => item.id !== stopId),
            };
          });
          const categories = stop
            ? adjustTickets(state.trip.categories, -stop.ticketPrice)
            : state.trip.categories;
          return { trip: { ...state.trip, days, categories } };
        });
      },

      moveStop: (dayId, stopId, direction) =>
        set((state) => {
          const days = state.trip.days.map((day) => {
            if (day.id !== dayId) {
              return day;
            }
            const index = day.stops.findIndex((stop) => stop.id === stopId);
            if (index < 0) {
              return day;
            }
            const target = index + direction;
            if (target < 0 || target >= day.stops.length) {
              return day;
            }
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
      version: 1,
      partialize: (state) => ({ trip: state.trip }),
    },
  ),
);

/** Convenience selectors. */
export const selectTrip = (state: TripStore) => state.trip;