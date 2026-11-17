/**
 * Mock data for the Trips screen.
 * Image URLs are the placeholders exported from the Stitch trip design.
 * Replace with Supabase rows when the data layer is added.
 */

export type TripStop = {
  id: string;
  time: string;
  duration: string;
  name: string;
  rating: number;
  reviewCount: string;
  description: string;
  image: string;
  ticketLabel: string;
};

export type TripDay = {
  id: string;
  shortLabel: string;
  dateLabel: string;
  title: string;
  meta: string;
  stops: TripStop[];
};

export type TripBudgetSegment = {
  id: string;
  label: string;
  amount: string;
  /** Flex weight for the segmented bar. */
  weight: number;
  /** Colour token key resolved from the theme. */
  color: 'primary' | 'gold' | 'emerald' | 'secondary';
};

export type TripTraveler = {
  id: string;
  name: string;
  image: string;
};

export const tripTravelerImages = [
  'https://lh3.googleusercontent.com/aida/ALJJyrDkPHlYU9jqYeYUNcIPBUnDIccYxvTqnc9uEtYl5i0k3cP9htK9cqhrialvDNtPa_AmFaLeiTCIzd3WhoWZEE7AdcfJJHhyRwaPSaDQ8twI_P4FVzOTAwaAKXj8JGeJlCT4kGrtF-qmYYXLkk3OlbX5MNHJWVXvYbnUZk8RlGCpJ8krewiRHQyRTitToqJ7RqnmtprJfqCj4c1DDBIJU0VKFrMLJ0YhFrimwoJ1WActv0MRMXbx',
  'https://lh3.googleusercontent.com/aida/ALJJyrAsF40ZXN-v1Vulvw4aG7ozy4xUh0rqhqOFMW886NrUB8-GWJf9jZwEkv-Ajh0PFbQ7zXhxjaw-voWbJKcWJhvVjUH2pm-0EJyjpfM4c-BjVlBoHgYLLJ4bOMmDh1o26k26rnK3ivgSB-o-HPB_KbnJmvzvkGLTViG3L4XzwDRBau4qjDos9RrEdaX7Hb2dEKKcUCx4oTJfCvDBML9UVR_WGyPIUmgC1M2VwfiYFzF7iDrtg1HjyZDRlg',
  'https://lh3.googleusercontent.com/aida/ALJJyrAjUhI48ZDKp28fejkFV1XFAmrX-OEA1s_0H4-uaQoDkZ6leeTxBLp1ktAKMCvz9-6LvDrSEqQZn7ufsCDJT7XyocWrOcyPSc4MKzPFeVN-4WSieZRET9oj0rRmDpYgd4xy1ZeWY739kTXJcM69UiGhtfz-9Wji0K71McAMegwX0p3S8aWvtuX06ZCvnEpalSJWtp16cpjXbA77FhZkez-NqWtJs-XzNLCe4Ljcsfvc6jjfMA',
];

export const tripHeader = {
  chip: 'Rajasthan Circuit',
  title: 'Royal Heritage of Rajasthan',
  subtitle: 'Jaipur & Amer',
  dates: '3 Days · Oct 24 - 26, 2025',
  confirmed: 'Confirmed Trip',
  travelerCount: 4,
};

export const tripStats = {
  sites: {
    label: 'Sites to Visit',
    value: '8',
    detail: '3 UNESCO Sites',
  },
  budget: {
    label: 'Est. Budget',
    value: '₹14,500',
    detail: '₹3,625 / traveler',
  },
};

export const tripBudget = {
  total: '₹14,500',
  prepaid: '₹6,000',
  prepaidNote: 'of ₹14,500 pre-paid',
  segments: [
    { id: 'tickets', label: 'Tickets', amount: '₹2.1k', weight: 2.1, color: 'primary' },
    { id: 'travel', label: 'Travel', amount: '₹4.2k', weight: 4.2, color: 'gold' },
    { id: 'guides', label: 'Guides', amount: '₹3.5k', weight: 3.5, color: 'emerald' },
    { id: 'food', label: 'Food', amount: '₹5k', weight: 5, color: 'secondary' },
  ] satisfies TripBudgetSegment[],
};

const amberFortImage =
  'https://lh3.googleusercontent.com/aida/ALJJyrAsF40ZXN-v1Vulvw4aG7ozy4xUh0rqhqOFMW886NrUB8-GWJf9jZwEkv-Ajh0PFbQ7zXhxjaw-voWbJKcWJhvVjUH2pm-0EJyjpfM4c-BjVlBoHgYLLJ4bOMmDh1o26k26rnK3ivgSB-o-HPB_KbnJmvzvkGLTViG3L4XzwDRBau4qjDos9RrEdaX7Hb2dEKKcUCx4oTJfCvDBML9UVR_WGyPIUmgC1M2VwfiYFzF7iDrtg1HjyZDRlg';
const hawaMahalImage =
  'https://lh3.googleusercontent.com/aida/ALJJyrDxvgaELk8cAG6h3gEOg1Py7XM4-zXzJgCcnoYXcvP8lCbqltYbdugh3kT1S3SVA48h6J7Ojqs3Umg95lmzYybNJVG5nUt9pAoQD27UN7i2JB7XmpuLLX9N79LUhardPJ7fWeAu5O_j_qRvNlKjEJR-xZbNWkwQIb3q_pBs1uu-nBOHpe6wc3qJUYx-L_OmZGenrJ5hIV74NN4coiRSIL0XL0126-YktNBhoWpoMF8BeYML';
const nahargarhImage =
  'https://lh3.googleusercontent.com/aida/ALJJyrAuCPVc8krc4DaJBLMqoN1r8jq9cwFN8j_LcPBn0T_AXCbfizFzQ_bp8ApiwgjN5qPipDCs8DoTY-0OpCYyQRofKgfoNP7fLJJ1s-6rd6nWLh0XfHH0OkRxIG-crr-yzQwqYrwfu-srV2I7Kfg5fqy4r-OH1pc-FjlDIUV_o7TlfLL_Jq8ck6bqEqx9q4zjNTvIQRQIbL08icQ7lBVSgsbd5Swssq0nDqj3OOyKWSCo48pxTjmRVWmuKg';

export const tripDays: TripDay[] = [
  {
    id: 'day-1',
    shortLabel: 'Day 1',
    dateLabel: 'Oct 24',
    title: 'Amber & Forts',
    meta: '4 places · 18 km total travel',
    stops: [
      {
        id: 'amber-fort',
        time: '08:30 AM – 12:30 PM',
        duration: '4 hrs',
        name: 'Amber Fort & Palace',
        rating: 4.8,
        reviewCount: '34K',
        description:
          'Explore Sheesh Mahal, royal courtyards, & Maota Lake gardens before the midday rush.',
        image: amberFortImage,
        ticketLabel: '₹100',
      },
      {
        id: 'nahargarh-fort',
        time: '02:00 PM – 04:00 PM',
        duration: '2 hrs',
        name: 'Nahargarh Fort',
        rating: 4.6,
        reviewCount: '21K',
        description:
          'Panoramic sunset views over the Pink City from the Aravalli ridge ramparts.',
        image: nahargarhImage,
        ticketLabel: '₹50',
      },
      {
        id: 'jal-mahal',
        time: '04:30 PM – 05:30 PM',
        duration: '1 hr',
        name: 'Jal Mahal',
        rating: 4.5,
        reviewCount: '18K',
        description:
          'Photo stop at the water palace floating in the middle of Man Sagar Lake.',
        image: hawaMahalImage,
        ticketLabel: 'Free',
      },
      {
        id: 'amber-anokhi',
        time: '06:00 PM – 07:30 PM',
        duration: '1.5 hrs',
        name: 'Anokhi Museum',
        rating: 4.7,
        reviewCount: '2K',
        description:
          'Block-printing heritage in a restored haveli near the Amber Fort ramparts.',
        image: amberFortImage,
        ticketLabel: '₹80',
      },
    ],
  },
  {
    id: 'day-2',
    shortLabel: 'Day 2',
    dateLabel: 'Oct 25',
    title: 'Old Pink City',
    meta: '3 places · 6 km total travel',
    stops: [
      {
        id: 'hawa-mahal',
        time: '09:00 AM – 10:30 AM',
        duration: '1.5 hrs',
        name: 'Hawa Mahal',
        rating: 4.7,
        reviewCount: '52K',
        description:
          'The Palace of Winds with 953 jharokhas overlooking the Pink City bazaar.',
        image: hawaMahalImage,
        ticketLabel: '₹50',
      },
      {
        id: 'city-palace',
        time: '11:00 AM – 01:00 PM',
        duration: '2 hrs',
        name: 'City Palace',
        rating: 4.6,
        reviewCount: '29K',
        description:
          'Chandra Mahal and Mubarak Mahal courtyards with royal textile and armour collections.',
        image: amberFortImage,
        ticketLabel: '₹200',
      },
      {
        id: 'jantar-mantar',
        time: '02:30 PM – 04:00 PM',
        duration: '1.5 hrs',
        name: 'Jantar Mantar',
        rating: 4.5,
        reviewCount: '12K',
        description:
          'UNESCO-listed astronomical observatory built by Maharaja Sawai Jai Singh II.',
        image: hawaMahalImage,
        ticketLabel: '₹50',
      },
    ],
  },
  {
    id: 'day-3',
    shortLabel: 'Day 3',
    dateLabel: 'Oct 26',
    title: 'Gardens & Farewell',
    meta: '3 places · 12 km total travel',
    stops: [
      {
        id: 'sisodia-rani',
        time: '08:30 AM – 10:00 AM',
        duration: '1.5 hrs',
        name: 'Sisodia Rani Garden',
        rating: 4.4,
        reviewCount: '9K',
        description:
          'Terraced Mughal-style gardens with painted pavilions and water channels.',
        image: nahargarhImage,
        ticketLabel: '₹20',
      },
      {
        id: 'galtaji',
        time: '10:30 AM – 12:00 PM',
        duration: '1.5 hrs',
        name: 'Galtaji Temple',
        rating: 4.5,
        reviewCount: '15K',
        description:
          'Hilltop pilgrimage complex with seven sacred kunds and resident monkeys.',
        image: nahargarhImage,
        ticketLabel: 'Free',
      },
      {
        id: 'albert-hall',
        time: '03:00 PM – 05:00 PM',
        duration: '2 hrs',
        name: 'Albert Hall Museum',
        rating: 4.6,
        reviewCount: '22K',
        description:
          'Indo-Saracenic state museum with Egyptian mummies and Rajasthani miniature art.',
        image: amberFortImage,
        ticketLabel: '₹150',
      },
    ],
  },
];