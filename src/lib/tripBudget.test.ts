/// <reference types="jest" />

import { computeTripBudget } from './tripBudget';

describe('computeTripBudget', () => {
  it('no stops, food 5000 only -> total 5000 and the food share is 100%', () => {
    const result = computeTripBudget({
      days: [],
      travelerCount: 1,
      travel: 0,
      guides: 0,
      food: 5000,
      prepaid: 0,
    });

    expect(result.total).toBe(5000);
    expect(result.food).toBe(5000);
    expect(result.tickets).toBe(0);
    expect(result.travel).toBe(0);
    expect(result.guides).toBe(0);
    expect(result.shares.food).toBe(1);
    expect(result.shares.tickets).toBe(0);
    expect(result.shares.travel).toBe(0);
    expect(result.shares.guides).toBe(0);
  });

  it('3 stops with tickets 100, 150 and 50, 4 travelers -> tickets = 1200', () => {
    const result = computeTripBudget({
      days: [
        { stops: [{ ticketPrice: 100 }, { ticketPrice: 150 }] },
        { stops: [{ ticketPrice: 50 }] },
      ],
      travelerCount: 4,
      travel: 0,
      guides: 0,
      food: 0,
      prepaid: 0,
    });

    expect(result.tickets).toBe(1200);
    expect(result.total).toBe(1200);
  });

  it('total equals tickets + travel + guides + food in every case', () => {
    const cases = [
      computeTripBudget({
        days: [{ stops: [{ ticketPrice: 100 }, { ticketPrice: 200 }] }],
        travelerCount: 2,
        travel: 500,
        guides: 300,
        food: 700,
        prepaid: 100,
      }),
      computeTripBudget({
        days: [],
        travelerCount: 3,
        travel: 1000,
        guides: 0,
        food: 250,
        prepaid: 0,
      }),
      computeTripBudget({
        days: [{ stops: [{ ticketPrice: 0 }] }],
        travelerCount: 1,
        travel: 0,
        guides: 0,
        food: 0,
        prepaid: 0,
      }),
    ];

    for (const result of cases) {
      expect(result.total).toBe(
        result.tickets + result.travel + result.guides + result.food,
      );
    }
  });

  it('travelers = 0 does not divide by zero', () => {
    const result = computeTripBudget({
      days: [{ stops: [{ ticketPrice: 100 }] }],
      travelerCount: 0,
      travel: 500,
      guides: 0,
      food: 0,
      prepaid: 0,
    });

    expect(Number.isFinite(result.perTraveler)).toBe(true);
    expect(result.perTraveler).toBe(500);
    expect(result.tickets).toBe(0);
    expect(result.total).toBe(500);
  });

  it('NaN and undefined inputs count as 0', () => {
    const result = computeTripBudget({
      days: [
        { stops: [{ ticketPrice: NaN }, { ticketPrice: undefined }, { ticketPrice: null }] },
        { stops: undefined },
        { stops: null },
      ],
      travelerCount: NaN,
      travel: undefined,
      guides: NaN,
      food: null,
      prepaid: undefined,
    });

    expect(result.tickets).toBe(0);
    expect(result.travel).toBe(0);
    expect(result.guides).toBe(0);
    expect(result.food).toBe(0);
    expect(result.total).toBe(0);
    expect(result.perTraveler).toBe(0);
    expect(result.prepaid).toBe(0);
    expect(result.remaining).toBe(0);
    expect(result.shares).toEqual({ tickets: 0, travel: 0, guides: 0, food: 0 });
  });

  it('prepaid larger than total gives remaining 0', () => {
    const result = computeTripBudget({
      days: [],
      travelerCount: 2,
      travel: 100,
      guides: 0,
      food: 0,
      prepaid: 500,
    });

    expect(result.total).toBe(100);
    expect(result.remaining).toBe(0);
  });
});
