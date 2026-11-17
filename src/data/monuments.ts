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
  eyebrow?: string;
  badge?: string;
  initiallySaved?: boolean;
  locationLabel?: string;
  description?: string;
  ticketLabel?: string;
  distanceKm?: number;
  timings?: string;
  lat: number;
  lng: number;
};

export type ExploreFilterIcon = 'category' | 'star' | 'ac-unit';

export type ExploreFilter = {
  id: string;
  label: string;
  icon?: ExploreFilterIcon;
  iconTone?: 'primary' | 'gold' | 'outline';
  showChevron?: boolean;
};

/** Content for app/monument/[id]. Mirrors amber-fort-details.html. */
export type MonumentDetail = {
  dynasty: string;
  address: string;
  reviewCount: string;
  heroImage: string;
  galleryImage?: string;
  photoCount: string;
  timings: string;
  entryFee: string;
  bestTime: string;
  duration: string;
  overview: string;
  highlights: {
    icon: 'auto-awesome' | 'door-front' | 'theater-comedy';
    title: string;
    description: string;
  }[];
  audioTour: {
    title: string;
    subtitle: string;
    price: string;
  };
  review: {
    initials: string;
    name: string;
    meta: string;
    rating: number;
    text: string;
  };
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

export const exploreFilters: ExploreFilter[] = [
  {
    id: 'state',
    label: 'State: Rajasthan',
    showChevron: true,
  },
  {
    id: 'category',
    label: 'Category: Forts',
    icon: 'category',
    iconTone: 'primary',
    showChevron: true,
  },
  {
    id: 'rating',
    label: '4.5+',
    icon: 'star',
    iconTone: 'gold',
  },
  {
    id: 'entry',
    label: 'Entry: Under ₹100',
  },
  {
    id: 'season',
    label: 'Winter Season',
    icon: 'ac-unit',
    iconTone: 'primary',
  },
];

export const exploreMonuments: Monument[] = [
  {
    id: 'amber-fort',
    name: 'Amber Fort & Palace',
    state: 'Rajasthan',
    city: 'Jaipur',
    category: 'Fort',
    image:
      'https://lh3.googleusercontent.com/aida/ALJJyrAsF40ZXN-v1Vulvw4aG7ozy4xUh0rqhqOFMW886NrUB8-GWJf9jZwEkv-Ajh0PFbQ7zXhxjaw-voWbJKcWJhvVjUH2pm-0EJyjpfM4c-BjVlBoHgYLLJ4bOMmDh1o26k26rnK3ivgSB-o-HPB_KbnJmvzvkGLTViG3L4XzwDRBau4qjDos9RrEdaX7Hb2dEKKcUCx4oTJfCvDBML9UVR_WGyPIUmgC1M2VwfiYFzF7iDrtg1HjyZDRlg',
    rating: 4.9,
    isUnesco: true,
    eyebrow: 'Hill Forts of Rajasthan',
    badge: 'UNESCO Site',
    initiallySaved: true,
    locationLabel: 'Jaipur',
    description:
      '16th-century fortress on Cheel ka Teela with serpentine ramparts and mirror-inlaid royal chambers.',
    ticketLabel: '₹100',
    lat: 26.9858,
    lng: 75.8513,
  },
  {
    id: 'brihadeeswara-temple',
    name: 'Brihadeeswara Temple',
    state: 'Tamil Nadu',
    city: 'Thanjavur',
    category: 'Temple',
    image:
      'https://lh3.googleusercontent.com/aida/ALJJyrA4osHXyztggwmGb24MGkd2cmMelQ_xr7JwJasgkw2_PMfYXZyWbN5MDNGt1TxE2HfjPPmUzQ3XUYv5SHu-hV7N0oQWbLQN2ucqtqkqbrEcV3AvnuC0loUSgY5VkrbXmzsBYJAAJqckEP-vKuB35zczjZyPYwGahlhW_9_-zpkWyfbQbgRP2DMt00Rr3EnxYCXVC6wXYk7GjZo2xr4MANB1JKy8TkOCuTf0SHgkA1WlbNWDK-RPulm1b-0oZg0_',
    rating: 4.9,
    isUnesco: true,
    eyebrow: 'Chola Dynasty (1010 CE)',
    badge: 'Great Living Chola Temple',
    initiallySaved: false,
    locationLabel: 'Thanjavur, TN',
    description:
      'Monolithic granite temple dedicated to Lord Shiva with an astronomical vimana and 16-foot monolithic Nandi.',
    ticketLabel: 'Free Entry',
    lat: 10.7828,
    lng: 79.1318,
  },
  {
    id: 'stone-chariot',
    name: 'Stone Chariot & Temples',
    state: 'Karnataka',
    city: 'Hampi',
    category: 'UNESCO',
    image:
      'https://lh3.googleusercontent.com/aida/ALJJyrCfaE_puDwAt_gDYX1wh83Nq3yC5LZoJ-vBjkCckkotB2IodsL0WMhfqjAhtsiE5t0fApKx0z5H7WQzgljw25VrxQF08rh7QjLXLmeQOOrOVsyLr24Sf2M0amEUWzQXm0Z3UTJCPEA8L_KWH4xT0TCuzTQ2MKZpwlt8kQJpnS-L_L07n8YMCubzj3reuqz9XexJ7vbP6vhHapIPEZEfWj-AKJEAo4qgQcbgb6mZv076zZ-ZPzpqHQ',
    rating: 4.8,
    isUnesco: true,
    eyebrow: 'Vittala Complex',
    badge: 'Vijayanagara Empire',
    initiallySaved: false,
    locationLabel: 'Hampi, Karnataka',
    description:
      'Ornate stone shrine dedicated to Garuda set amidst dramatic boulder hills and musical pillar pavilions.',
    ticketLabel: '₹40',
    lat: 15.335,
    lng: 76.46,
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

export const monumentDetails: Record<string, MonumentDetail> = {
  'amber-fort': {
    dynasty: 'Kachwaha Dynasty • 1592 CE',
    address: 'Devisinghpura, Amer, Jaipur, Rajasthan 302001',
    reviewCount: '18,420 reviews',
    heroImage:
      'https://lh3.googleusercontent.com/aida/ALJJyrAsF40ZXN-v1Vulvw4aG7ozy4xUh0rqhqOFMW886NrUB8-GWJf9jZwEkv-Ajh0PFbQ7zXhxjaw-voWbJKcWJhvVjUH2pm-0EJyjpfM4c-BjVlBoHgYLLJ4bOMmDh1o26k26rnK3ivgSB-o-HPB_KbnJmvzvkGLTViG3L4XzwDRBau4qjDos9RrEdaX7Hb2dEKKcUCx4oTJfCvDBML9UVR_WGyPIUmgC1M2VwfiYFzF7iDrtg1HjyZDRlg',
    galleryImage:
      'https://lh3.googleusercontent.com/aida/ALJJyrDnE4ordyyeLqErXXZ_xK3rDBbLiBHxeX0TX4mX4b8ZJEDyySZc6hUdaUDZcRUqTlKsWBP8YY-jrP8mL-vhkeVRwXuOoqlfPMVbFmf-bVwRqzS3VXT_Tyh4XpqCAosFE5A4LBJaD0f-ULvD5yP0mczYCD8o0lzJ6H9VU55Al5hqsnvcH3KABmtFL3Axw2_gwOecH-NxL46UwR9WDhgFViDx7_WH11NA93Qp8RMtxpejtubJuVc6j7OiO1vkmx4jpEX8',
    photoCount: '1 / 18 Photos',
    timings: '8 AM - 7 PM',
    entryFee: '₹100 / ₹550',
    bestTime: 'Oct - Mar',
    duration: '2.5 - 3 Hrs',
    overview:
      'Perched high on the rugged Cheel ka Teela (Hill of Eagles), Amber Fort is celebrated for its artistic Hindu-style elements. Built with red sandstone and white marble, the opulent palace complex is laid out over four distinct courtyards overlooking the tranquil waters of Maota Lake.',
    highlights: [
      {
        icon: 'auto-awesome',
        title: 'Sheesh Mahal (Hall of Mirrors)',
        description:
          'Convex Belgian mirror tiles that illuminate the whole royal chamber with a single candlelight.',
      },
      {
        icon: 'door-front',
        title: 'Ganesh Pol Gateway',
        description:
          'Three-level ceremonial gate adorned with traditional Rajasthani frescoes and jali lattice screens.',
      },
      {
        icon: 'theater-comedy',
        title: 'Evening Sound & Light Show',
        description:
          'Narrated in Hindi & English highlighting 600 years of Kachwaha valor and Rajput royal pageantry.',
      },
    ],
    audioTour: {
      title: 'Self-Guided Audio Tour',
      subtitle: 'Available in 8 languages • 45 mins',
      price: 'Listen ₹99',
    },
    review: {
      initials: 'PK',
      name: 'Pooja Kulkarni',
      meta: 'Visited last weekend',
      rating: 5,
      text: '"The mirror hall was breathtaking in person. We walked up the ramparts early around 8:30 AM to beat the crowd and the morning light over Maota Lake was truly cinematic."',
    },
  },
};

export function getMonument(id: string): Monument | undefined {
  return allMonuments.find((monument) => monument.id === id);
}

export function getMonumentDetail(id: string): MonumentDetail | undefined {
  return monumentDetails[id];
}