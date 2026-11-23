export type TripBudgetInput = {
  days?: Array<{
    stops?: Array<{
      ticketPrice?: number | null;
    }> | null;
  }> | null;
  travelerCount?: number | null;
  travel?: number | null;
  guides?: number | null;
  food?: number | null;
  prepaid?: number | null;
};

export type BudgetShares = {
  tickets: number;
  travel: number;
  guides: number;
  food: number;
};

export type TripBudget = {
  tickets: number;
  travel: number;
  guides: number;
  food: number;
  total: number;
  perTraveler: number;
  shares: BudgetShares;
  prepaid: number;
  remaining: number;
};

type TripLike = {
  days?: Array<{ stops?: Array<{ ticketPrice?: number | null }> | null }> | null;
  travelerCount?: number | null;
  prepaid?: number | null;
  categories?: Array<{ id?: string; amount?: number | null }> | null;
};

export function computeTripBudgetFromTrip(trip: TripLike): TripBudget {
  const categories = Array.isArray(trip.categories) ? trip.categories : [];
  const amountFor = (id: string) =>
    categories.find((c) => c?.id === id)?.amount;
  return computeTripBudget({
    days: trip.days ?? [],
    travelerCount: trip.travelerCount,
    travel: amountFor('travel'),
    guides: amountFor('guides'),
    food: amountFor('food'),
    prepaid: trip.prepaid,
  });
}

function toWholeRupees(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

function toCount(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

export function computeTripBudget(input: TripBudgetInput): TripBudget {
  const travelerCount = toCount(input.travelerCount);
  const days = Array.isArray(input.days) ? input.days : [];

  let ticketPerPerson = 0;
  for (const day of days) {
    const stops = Array.isArray(day?.stops) ? day.stops : [];
    for (const stop of stops) {
      ticketPerPerson += toWholeRupees(stop?.ticketPrice);
    }
  }

  const tickets = ticketPerPerson * travelerCount;
  const travel = toWholeRupees(input.travel);
  const guides = toWholeRupees(input.guides);
  const food = toWholeRupees(input.food);
  const total = tickets + travel + guides + food;
  const perTraveler = Math.round(total / Math.max(travelerCount, 1));
  const prepaidRaw = toWholeRupees(input.prepaid);
  const prepaid = Math.min(prepaidRaw, total);
  const remaining = Math.max(total - prepaid, 0);

  const shares: BudgetShares =
    total === 0
      ? { tickets: 0, travel: 0, guides: 0, food: 0 }
      : {
          tickets: tickets / total,
          travel: travel / total,
          guides: guides / total,
          food: food / total,
        };

  return {
    tickets,
    travel,
    guides,
    food,
    total,
    perTraveler,
    shares,
    prepaid,
    remaining,
  };
}
