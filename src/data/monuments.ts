/**
 * Mock data for Bharat Darshan.
 * Image URLs are the placeholders exported from the Stitch designs.
 * Replace with Supabase rows when the data layer is added.
 */

export type CategoryIcon =
  | 'castle'
  | 'temple-hindu'
  | 'account-balance'
  | 'verified'
  | 'museum'
  | 'forest';

export type CategoryTone = 'primary' | 'secondary' | 'gold' | 'emerald' | 'muted';

export type HomeCategory = {
  id: string;
  label: string;
  icon: CategoryIcon;
  tone: CategoryTone;
};

export type Monument = {
  id: string;
  name: string;
  state: string;
  city: string;
  category: string;
  image: string;
  rating: number;
  reviewCount?: string;
  isUnesco?: boolean;
  description?: string;
  ticketLabel?: string;
  distanceKm?: number;
  timings?: string;
  lat: number;
  lng: number;
};

export const travelerAvatar =
  'https://lh3.googleusercontent.com/aida/ALJJyrDkPHlYU9jqYeYUNcIPBUnDIccYxvTqnc9uEtYl5i0k3cP9htK9cqhrialvDNtPa_AmFaLeiTCIzd3WhoWZEE7AdcfJJHhyRwaPSaDQ8twI_P4FVzOTAwaAKXj8JGeJlCT4kGrtF-qmYYXLkk3OlbX5MNHJWVXvYbnUZk8RlGCpJ8krewiRHQyRTitToqJ7RqnmtprJfqCj4c1DDBIJU0VKFrMLJ0YhFrimwoJ1WActv0MRMXbx';

export const homeCategories: HomeCategory[] = [
  { id: 'forts', label: 'Forts', icon: 'castle', tone: 'primary' },
  { id: 'temples', label: 'Temples', icon: 'temple-hindu', tone: 'primary' },
  { id: 'palaces', label: 'Palaces', icon: 'account-balance', tone: 'secondary' },
  { id: 'unesco', label: 'UNESCO Sites', icon: 'verified', tone: 'gold' },
  { id: 'museums', label: 'Museums', icon: 'museum', tone: 'muted' },
  { id: 'nature', label: 'Nature', icon: 'forest', tone: 'emerald' },
];

export const featuredMonuments: Monument[] = [
  {
    id: 'amber-fort',
    name: 'Amber Fort & Palace',
    state: 'Rajasthan',
    city: 'Jaipur',
    category: 'Fort',
    image:
      'https://lh3.googleusercontent.com/aida/ALJJyrAsF40ZXN-v1Vulvw4aG7ozy4xUh0rqhqOFMW886NrUB8-GWJf9jZwEkv-Ajh0PFbQ7zXhxjaw-voWbJKcWJhvVjUH2pm-0EJyjpfM4c-BjVlBoHgYLLJ4bOMmDh1o26k26rnK3ivgSB-o-HPB_KbnJmvzvkGLTViG3L4XzwDRBau4qjDos9RrEdaX7Hb2dEKKcUCx4oTJfCvDBML9UVR_WGyPIUmgC1M2VwfiYFzF7iDrtg1HjyZDRlg',
    rating: 4.9,
    reviewCount: '4.2k reviews',
    isUnesco: true,
    description:
      'Hilltop majesty built by Raja Man Singh I, famed for the glittering Sheesh Mahal.',
    ticketLabel: '₹100 (Indians)',
    timings: '8:00 AM – 5:30 PM',
    lat: 26.9858,
    lng: 75.8513,
  },
];

export const popularMonuments: Monument[] = [
  {
    id: 'hawa-mahal',
    name: 'Hawa Mahal',
    state: 'Rajasthan',
    city: 'Jaipur',
    category: 'Palace',
    image:
      'https://lh3.googleusercontent.com/aida/ALJJyrDxvgaELk8cAG6h3gEOg1Py7XM4-zXzJgCcnoYXcvP8lCbqltYbdugh3kT1S3SVA48h6J7Ojqs3Umg95lmzYybNJVG5nUt9pAoQD27UN7i2JB7XmpuLLX9N79LUhardPJ7fWeAu5O_j_qRvNlKjEJR-xZbNWkwQIb3q_pBs1uu-nBOHpe6wc3qJUYx-L_OmZGenrJ5hIV74NN4coiRSIL0XL0126-YktNBhoWpoMF8BeYML',
    rating: 4.7,
    ticketLabel: '₹50',
    distanceKm: 2.4,
    lat: 26.9239,
    lng: 75.8267,
  },
  {
    id: 'qutub-minar',
    name: 'Qutub Minar',
    state: 'Delhi',
    city: 'New Delhi',
    category: 'UNESCO',
    image:
      'https://lh3.googleusercontent.com/aida/ALJJyrAjUhI48ZDKp28fejkFV1XFAmrX-OEA1s_0H4-uaQoDkZ6leeTxBLp1ktAKMCvz9-6LvDrSEqQZn7ufsCDJT7XyocWrOcyPSc4MKzPFeVN-4WSieZRET9oj0rRmDpYgd4xy1ZeWY739kTXJcM69UiGhtfz-9Wji0K71McAMegwX0p3S8aWvtuX06ZCvnEpalSJWtp16cpjXbA77FhZkez-NqWtJs-XzNLCe4Ljcsfvc6jjfMA',
    rating: 4.8,
    isUnesco: true,
    ticketLabel: '₹550',
    distanceKm: 1240,
    lat: 28.5244,
    lng: 77.1855,
  },
];

export const allMonuments: Monument[] = [...featuredMonuments, ...popularMonuments];