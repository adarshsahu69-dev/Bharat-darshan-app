/**
 * Mock data for Bharat Darshan.
 *
 * Categories are non-exclusive: a monument has a primary `category` plus any
 * number of `categories` tags, and `isUnesco` is a flag rather than an
 * exclusive bucket.
 *
 * Image URLs: Wikimedia Commons `Special:FilePath` URLs with a width hint.
 * These resolve to stable, CORS-friendly thumbnails (the original Stitch
 * `googleusercontent` links expire and redirect to a login page, which is why
 * cards rendered blank).
 *
 * Replace with Supabase rows when the data layer is added.
 */

export type CategoryId =
  | 'forts'
  | 'temples'
  | 'palaces'
  | 'unesco'
  | 'museums'
  | 'nature';

export type CategoryIcon =
  | 'castle'
  | 'temple-hindu'
  | 'account-balance'
  | 'verified'
  | 'museum'
  | 'forest';

export type CategoryTone = 'primary' | 'secondary' | 'gold' | 'emerald' | 'muted';

export type HomeCategory = {
  id: CategoryId;
  label: string;
  icon: CategoryIcon;
  tone: CategoryTone;
};

/** Primary classification shown on cards. */
export type MonumentCategory = 'Fort' | 'Temple' | 'Palace' | 'Museum' | 'Nature';

export type Monument = {
  id: string;
  name: string;
  state: string;
  city: string;
  category: MonumentCategory;
  /** All category ids this monument belongs to (non-exclusive). */
  categories: CategoryId[];
  image: string;
  rating: number;
  reviewCount?: string;
  isUnesco?: boolean;
  eyebrow?: string;
  badge?: string;
  initiallySaved?: boolean;
  locationLabel?: string;
  description?: string;
  /** Raw numeric ticket price in rupees (0 = free). */
  ticketPrice: number;
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

const Wikimedia = (file: string, width = 800) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`;

const IMG = {
  amberFort: Wikimedia('Jaipur 03-2016 02 Amber Fort.jpg'),
  jaigarh: Wikimedia('Jaigarh Fort, Jaipur, 20191218 1554 9349.jpg'),
  nahargarh: Wikimedia('Nahargarh Fort, Jaipur, 20191218 1529 9314.jpg'),
  chittor: Wikimedia('Jauhar Sthal in Chittorgarh Fort, Rajasthan, India.jpg'),
  gwalior: Wikimedia('Gwalior fort view 003 (15).jpg'),
  kangra: Wikimedia('Kangra Fort.jpg'),
  hawaMahal: Wikimedia('Hawa Mahal 2011.jpg'),
  cityPalace: Wikimedia('Jaipur 03-2016 20 City Palace complex.jpg'),
  jalMahal: Wikimedia('Jaipur 03-2016 39 Jal Mahal - Water Palace.jpg'),
  mysorePalace: Wikimedia('Mysore Palace Morning.jpg'),
  brihadeeswara: Wikimedia('Brihadeeswara Temple-side view.jpg'),
  khajuraho: Wikimedia('Khajuraho Dulhadeo 2010.jpg'),
  konark: Wikimedia('Sun Temple Main Structure, Konark, Orissa.jpg'),
  meenakshi: Wikimedia('Sri Meenakshi Devasthanam Temple (east-exposure).jpg'),
  somnath: Wikimedia('Shree Somnath Temple.jpg'),
  kashi: Wikimedia('Shri Kashi Vishwanath Temple 7.jpg'),
  qutub: Wikimedia('Qutb Minar 2011.jpg'),
  tajMahal: Wikimedia('Taj Mahal, Agra, India edit2.jpg'),
  stoneChariot: Wikimedia('Stone Chariot at Hampi, Karnataka.jpg'),
  sanchi: Wikimedia('Great Sanchi Stupa (3).jpg'),
  redFort: Wikimedia('Red Fort in Delhi 03-2016 img3.jpg'),
  nationalMuseum: Wikimedia('India national museum 01.jpg'),
  indianMuseum: Wikimedia('Mumbai - Chhatrapati Shivaji Maharaj Vastu Sangrahalaya.jpg'),
  chhatrapati: Wikimedia('Mumbai - Chhatrapati Shivaji Maharaj Vastu Sangrahalaya.jpg'),
  albertHall: Wikimedia('Albert Hall (Museum).JPG'),
  salarJung: Wikimedia('Courtyard of the Salar Jung Museum.jpg'),
  valleyFlowers: Wikimedia('Valley of flowers national park, Uttarakhand, India 03 (edit).jpg'),
  kaziranga: Wikimedia('Indian elephant in Kaziranga National Park March 2025 by Tisha Mukherjee 06.jpg'),
  gir: Wikimedia('Asiatic Lion Royal Walk at Gir National Park, Gujrat, India.jpg'),
  sundarbans: Wikimedia('Sundarban Mudflats during low tide, Sundarban Tiger Reserve, West Bengal, India 02.jpg'),
  westernGhats: Wikimedia('Landscapes of Western Ghats from Mullayyanagiri Betta.jpg'),
  andaman: Wikimedia('Radhanagar Beach in the Andaman Islands.jpg'),
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

export const exploreFilters: ExploreFilter[] = [
  { id: 'state', label: 'State: Rajasthan', showChevron: true },
  {
    id: 'category',
    label: 'Category: Forts',
    icon: 'category',
    iconTone: 'primary',
    showChevron: true,
  },
  { id: 'rating', label: '4.5+', icon: 'star', iconTone: 'gold' },
  { id: 'entry', label: 'Entry: Under ₹100' },
  { id: 'season', label: 'Winter Season', icon: 'ac-unit', iconTone: 'primary' },
];

export const allMonuments: Monument[] = [
  // ---------------------------------------------------------------- Forts
  {
    id: 'amber-fort',
    name: 'Amber Fort & Palace',
    state: 'Rajasthan',
    city: 'Jaipur',
    category: 'Fort',
    categories: ['forts', 'palaces', 'unesco'],
    image: IMG.amberFort,
    rating: 4.9,
    reviewCount: '18.4k',
    isUnesco: true,
    eyebrow: 'Hill Forts of Rajasthan',
    badge: 'UNESCO Site',
    initiallySaved: true,
    locationLabel: 'Jaipur',
    description:
      '16th-century fortress on Cheel ka Teela with serpentine ramparts and mirror-inlaid royal chambers.',
    ticketPrice: 100,
    ticketLabel: '₹100',
    timings: '8:00 AM – 5:30 PM',
    distanceKm: 11,
    lat: 26.9858,
    lng: 75.8513,
  },
  {
    id: 'jaigarh-fort',
    name: 'Jaigarh Fort',
    state: 'Rajasthan',
    city: 'Jaipur',
    category: 'Fort',
    categories: ['forts'],
    image: IMG.jaigarh,
    rating: 4.6,
    reviewCount: '8.1k',
    eyebrow: 'Victory Fort',
    locationLabel: 'Jaipur',
    description:
      'Hilltop fort guarding the Amber Fort, home to the world’s largest wheeled cannon, Jaivana.',
    ticketPrice: 150,
    ticketLabel: '₹150',
    timings: '9:00 AM – 5:00 PM',
    distanceKm: 13,
    lat: 27.0,
    lng: 75.8534,
  },
  {
    id: 'nahargarh-fort',
    name: 'Nahargarh Fort',
    state: 'Rajasthan',
    city: 'Jaipur',
    category: 'Fort',
    categories: ['forts'],
    image: IMG.nahargarh,
    rating: 4.5,
    reviewCount: '6.7k',
    eyebrow: 'Tiger Fort',
    locationLabel: 'Jaipur',
    description:
      'Aravalli ridge fort with panoramic sunset views over the Pink City and its old ramparts.',
    ticketPrice: 50,
    ticketLabel: '₹50',
    timings: '10:00 AM – 6:00 PM',
    distanceKm: 12,
    lat: 26.9384,
    lng: 75.8156,
  },
  {
    id: 'chittorgarh-fort',
    name: 'Chittorgarh Fort',
    state: 'Rajasthan',
    city: 'Chittorgarh',
    category: 'Fort',
    categories: ['forts', 'unesco'],
    image: IMG.chittor,
    rating: 4.7,
    reviewCount: '12.3k',
    isUnesco: true,
    eyebrow: 'Hill Forts of Rajasthan',
    badge: 'UNESCO Site',
    locationLabel: 'Chittorgarh',
    description:
      'Largest fort in India, sprawling over a plateau with Vijay Stambha and ancient reservoirs.',
    ticketPrice: 100,
    ticketLabel: '₹100',
    timings: '9:00 AM – 5:30 PM',
    distanceKm: 320,
    lat: 24.8887,
    lng: 74.6442,
  },
  {
    id: 'gwalior-fort',
    name: 'Gwalior Fort',
    state: 'Madhya Pradesh',
    city: 'Gwalior',
    category: 'Fort',
    categories: ['forts'],
    image: IMG.gwalior,
    rating: 4.6,
    reviewCount: '9.2k',
    eyebrow: 'Gopachal Hill',
    locationLabel: 'Gwalior',
    description:
      'Ancient hill fort celebrated for its blue-tiled Man Singh Palace and Jain rock-cut sculptures.',
    ticketPrice: 75,
    ticketLabel: '₹75',
    timings: '8:00 AM – 6:00 PM',
    distanceKm: 480,
    lat: 26.185,
    lng: 78.1671,
  },
  {
    id: 'kangra-fort',
    name: 'Kangra Fort',
    state: 'Himachal Pradesh',
    city: 'Kangra',
    category: 'Fort',
    categories: ['forts'],
    image: IMG.kangra,
    rating: 4.4,
    reviewCount: '4.5k',
    eyebrow: 'Katoch Dynasty',
    locationLabel: 'Kangra',
    description:
      'One of the oldest forts in the world, perched above the Banganga river gorge.',
    ticketPrice: 25,
    ticketLabel: '₹25',
    timings: '9:00 AM – 5:00 PM',
    distanceKm: 560,
    lat: 32.0994,
    lng: 76.2705,
  },

  // --------------------------------------------------------------- Temples
  {
    id: 'brihadeeswara-temple',
    name: 'Brihadeeswara Temple',
    state: 'Tamil Nadu',
    city: 'Thanjavur',
    category: 'Temple',
    categories: ['temples', 'unesco'],
    image: IMG.brihadeeswara,
    rating: 4.9,
    reviewCount: '15.1k',
    isUnesco: true,
    eyebrow: 'Chola Dynasty (1010 CE)',
    badge: 'Great Living Chola Temple',
    locationLabel: 'Thanjavur, TN',
    description:
      'Monolithic granite temple dedicated to Lord Shiva with an astronomical vimana and 16-foot Nandi.',
    ticketPrice: 0,
    ticketLabel: 'Free Entry',
    timings: '6:00 AM – 8:30 PM',
    distanceKm: 1240,
    lat: 10.7828,
    lng: 79.1318,
  },
  {
    id: 'khajuraho-temple',
    name: 'Khajuraho Temples',
    state: 'Madhya Pradesh',
    city: 'Chhatarpur',
    category: 'Temple',
    categories: ['temples', 'unesco'],
    image: IMG.khajuraho,
    rating: 4.8,
    reviewCount: '13.6k',
    isUnesco: true,
    eyebrow: 'Chandela Dynasty',
    badge: 'UNESCO Site',
    locationLabel: 'Khajuraho',
    description:
      'Group of Nagara-style temples famed for intricate erotic and spiritual stone carvings.',
    ticketPrice: 250,
    ticketLabel: '₹250',
    timings: '8:00 AM – 10:00 PM',
    distanceKm: 620,
    lat: 24.8318,
    lng: 79.9199,
  },
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple',
    state: 'Odisha',
    city: 'Konark',
    category: 'Temple',
    categories: ['temples', 'unesco'],
    image: IMG.konark,
    rating: 4.7,
    reviewCount: '11.8k',
    isUnesco: true,
    eyebrow: 'Eastern Ganga Dynasty',
    badge: 'UNESCO Site',
    locationLabel: 'Konark',
    description:
      '13th-century chariot-shaped temple to Surya, carved as an ornate stone-wheeled ratha.',
    ticketPrice: 40,
    ticketLabel: '₹40',
    timings: '6:00 AM – 6:00 PM',
    distanceKm: 1720,
    lat: 19.8876,
    lng: 86.0944,
  },
  {
    id: 'meenakshi-temple',
    name: 'Meenakshi Amman Temple',
    state: 'Tamil Nadu',
    city: 'Madurai',
    category: 'Temple',
    categories: ['temples'],
    image: IMG.meenakshi,
    rating: 4.8,
    reviewCount: '21.2k',
    eyebrow: 'Pandya Dynasty',
    locationLabel: 'Madurai',
    description:
      'Vast temple complex with towering gopurams covered in thousands of colourful sculptures.',
    ticketPrice: 0,
    ticketLabel: 'Free Entry',
    timings: '5:00 AM – 10:00 PM',
    distanceKm: 1460,
    lat: 9.9195,
    lng: 78.1193,
  },
  {
    id: 'somnath-temple',
    name: 'Somnath Temple',
    state: 'Gujarat',
    city: 'Somnath',
    category: 'Temple',
    categories: ['temples'],
    image: IMG.somnath,
    rating: 4.7,
    reviewCount: '9.9k',
    eyebrow: 'Chalukya Dynasty',
    locationLabel: 'Somnath',
    description:
      'First jyotirlinga shrine on the Arabian Sea coast, rebuilt many times through history.',
    ticketPrice: 0,
    ticketLabel: 'Free Entry',
    timings: '6:00 AM – 9:00 PM',
    distanceKm: 1020,
    lat: 20.888,
    lng: 70.4012,
  },
  {
    id: 'kashi-vishwanath',
    name: 'Kashi Vishwanath Temple',
    state: 'Uttar Pradesh',
    city: 'Varanasi',
    category: 'Temple',
    categories: ['temples'],
    image: IMG.kashi,
    rating: 4.8,
    reviewCount: '18.5k',
    eyebrow: 'Spiritual Capital',
    locationLabel: 'Varanasi',
    description:
      'One of the twelve jyotirlingas, set in the ancient ghats and lanes of Varanasi.',
    ticketPrice: 0,
    ticketLabel: 'Free Entry',
    timings: '2:30 AM – 11:00 PM',
    distanceKm: 1050,
    lat: 25.3109,
    lng: 83.0107,
  },

  // --------------------------------------------------------------- Palaces
  {
    id: 'hawa-mahal',
    name: 'Hawa Mahal',
    state: 'Rajasthan',
    city: 'Jaipur',
    category: 'Palace',
    categories: ['palaces'],
    image: IMG.hawaMahal,
    rating: 4.7,
    reviewCount: '26.8k',
    eyebrow: 'Palace of Winds',
    locationLabel: 'Jaipur',
    description:
      'Five-storey honeycomb facade of 953 jharokhas built for the royal ladies to watch street life.',
    ticketPrice: 50,
    ticketLabel: '₹50',
    timings: '9:00 AM – 4:30 PM',
    distanceKm: 2.4,
    lat: 26.9239,
    lng: 75.8267,
  },
  {
    id: 'city-palace-jaipur',
    name: 'City Palace, Jaipur',
    state: 'Rajasthan',
    city: 'Jaipur',
    category: 'Palace',
    categories: ['palaces', 'museums'],
    image: IMG.cityPalace,
    rating: 4.6,
    reviewCount: '14.3k',
    eyebrow: 'Chandra Mahal',
    locationLabel: 'Jaipur',
    description:
      'Grand royal residence with courtyards, museums and the ornate Chandra Mahal seven-storey tower.',
    ticketPrice: 200,
    ticketLabel: '₹200',
    timings: '9:30 AM – 5:00 PM',
    distanceKm: 3.1,
    lat: 26.9258,
    lng: 75.8237,
  },
  {
    id: 'jal-mahal',
    name: 'Jal Mahal',
    state: 'Rajasthan',
    city: 'Jaipur',
    category: 'Palace',
    categories: ['palaces'],
    image: IMG.jalMahal,
    rating: 4.5,
    reviewCount: '10.6k',
    eyebrow: 'Water Palace',
    locationLabel: 'Jaipur',
    description:
      'Rajput-style palace floating in the middle of the Man Sagar Lake, framed by the Nahargarh hills.',
    ticketPrice: 0,
    ticketLabel: 'Free (exterior)',
    timings: '6:00 AM – 6:00 PM',
    distanceKm: 9.5,
    lat: 26.9536,
    lng: 75.8454,
  },
  {
    id: 'mysore-palace',
    name: 'Mysore Palace',
    state: 'Karnataka',
    city: 'Mysuru',
    category: 'Palace',
    categories: ['palaces'],
    image: IMG.mysorePalace,
    rating: 4.8,
    reviewCount: '22.4k',
    eyebrow: 'Wadiyar Dynasty',
    locationLabel: 'Mysuru',
    description:
      'Indo-Saracenic royal palace with gilded domes, stained glass and the golden Durbar Hall.',
    ticketPrice: 200,
    ticketLabel: '₹200',
    timings: '10:00 AM – 5:30 PM',
    distanceKm: 1980,
    lat: 12.3068,
    lng: 76.6551,
  },
  {
    id: 'chandigarh-palace',
    name: 'Morni Palace',
    state: 'Haryana',
    city: 'Panchkula',
    category: 'Palace',
    categories: ['palaces'],
    image: IMG.jalMahal,
    rating: 4.2,
    reviewCount: '1.9k',
    eyebrow: 'Hill Retreat',
    locationLabel: 'Morni Hills',
    description:
      'Colonial-era hill palace overlooking the Morni hills, now a heritage resort.',
    ticketPrice: 0,
    ticketLabel: 'Hotel only',
    timings: 'Open 24 hours',
    distanceKm: 290,
    lat: 30.8969,
    lng: 76.9997,
  },
  {
    id: 'umaibhawan-palace',
    name: 'Umaid Bhawan Palace',
    state: 'Rajasthan',
    city: 'Jodhpur',
    category: 'Palace',
    categories: ['palaces', 'museums'],
    image: IMG.mysorePalace,
    rating: 4.7,
    reviewCount: '8.7k',
    eyebrow: 'Art Deco Palace',
    locationLabel: 'Jodhpur',
    description:
      'One of the world’s largest private residences, with a museum and lush palace gardens.',
    ticketPrice: 150,
    ticketLabel: '₹150',
    timings: '9:00 AM – 5:00 PM',
    distanceKm: 430,
    lat: 26.2425,
    lng: 73.0244,
  },

  // ---------------------------------------------------------------- UNESCO
  {
    id: 'qutub-minar',
    name: 'Qutub Minar',
    state: 'Delhi',
    city: 'New Delhi',
    category: 'Fort',
    categories: ['forts', 'unesco'],
    image: IMG.qutub,
    rating: 4.8,
    reviewCount: '24.1k',
    isUnesco: true,
    eyebrow: 'Delhi Sultanate',
    badge: 'UNESCO Site',
    locationLabel: 'New Delhi',
    description:
      '73-metre fluted sandstone victory tower, the tallest brick minaret in the world.',
    ticketPrice: 550,
    ticketLabel: '₹550',
    timings: '7:00 AM – 5:00 PM',
    distanceKm: 1240,
    lat: 28.5244,
    lng: 77.1855,
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    state: 'Uttar Pradesh',
    city: 'Agra',
    category: 'Palace',
    categories: ['palaces', 'unesco'],
    image: IMG.tajMahal,
    rating: 4.9,
    reviewCount: '38.2k',
    isUnesco: true,
    eyebrow: 'Mughal Architecture',
    badge: 'UNESCO Site',
    locationLabel: 'Agra',
    description:
      'White marble mausoleum on the Yamuna, celebrated as the jewel of Mughal architecture.',
    ticketPrice: 1100,
    ticketLabel: '₹1,100',
    timings: 'Sunrise – Sunset (closed Fri)',
    distanceKm: 1160,
    lat: 27.1751,
    lng: 78.0421,
  },
  {
    id: 'stone-chariot',
    name: 'Stone Chariot & Temples',
    state: 'Karnataka',
    city: 'Hampi',
    category: 'Temple',
    categories: ['temples', 'unesco'],
    image: IMG.stoneChariot,
    rating: 4.8,
    reviewCount: '10.4k',
    isUnesco: true,
    eyebrow: 'Vittala Complex',
    badge: 'Vijayanagara Empire',
    locationLabel: 'Hampi, Karnataka',
    description:
      'Ornate stone shrine dedicated to Garuda set amidst dramatic boulder hills and musical pillars.',
    ticketPrice: 40,
    ticketLabel: '₹40',
    timings: '6:00 AM – 6:00 PM',
    distanceKm: 1510,
    lat: 15.335,
    lng: 76.46,
  },
  {
    id: 'sanchi-stupa',
    name: 'Sanchi Stupa',
    state: 'Madhya Pradesh',
    city: 'Sanchi',
    category: 'Temple',
    categories: ['temples', 'unesco'],
    image: IMG.sanchi,
    rating: 4.7,
    reviewCount: '7.2k',
    isUnesco: true,
    eyebrow: 'Buddhist Complex',
    badge: 'UNESCO Site',
    locationLabel: 'Sanchi',
    description:
      'Mauryan-era hemispherical stupa with intricately carved gateways depicting the life of the Buddha.',
    ticketPrice: 250,
    ticketLabel: '₹250',
    timings: '6:30 AM – 6:30 PM',
    distanceKm: 780,
    lat: 23.4795,
    lng: 77.7395,
  },
  {
    id: 'red-fort',
    name: 'Red Fort',
    state: 'Delhi',
    city: 'New Delhi',
    category: 'Fort',
    categories: ['forts', 'unesco'],
    image: IMG.redFort,
    rating: 4.5,
    reviewCount: '19.7k',
    isUnesco: true,
    eyebrow: 'Mughal Citadel',
    badge: 'UNESCO Site',
    locationLabel: 'New Delhi',
    description:
      'Massive sandstone fort-palace that was the seat of Mughal power for nearly 200 years.',
    ticketPrice: 600,
    ticketLabel: '₹600',
    timings: '9:30 AM – 4:30 PM (closed Mon)',
    distanceKm: 1225,
    lat: 28.6562,
    lng: 77.241,
  },

  // --------------------------------------------------------------- Museums
  {
    id: 'national-museum',
    name: 'National Museum',
    state: 'Delhi',
    city: 'New Delhi',
    category: 'Museum',
    categories: ['museums'],
    image: IMG.nationalMuseum,
    rating: 4.5,
    reviewCount: '5.4k',
    eyebrow: 'National Collection',
    locationLabel: 'New Delhi',
    description:
      'Largest museum in India with over 200,000 works spanning 5,000 years of art and history.',
    ticketPrice: 0,
    ticketLabel: 'Free Entry',
    timings: '10:00 AM – 6:00 PM (closed Mon)',
    distanceKm: 1220,
    lat: 28.6143,
    lng: 77.225,
  },
  {
    id: 'indian-museum',
    name: 'Indian Museum',
    state: 'West Bengal',
    city: 'Kolkata',
    category: 'Museum',
    categories: ['museums'],
    image: IMG.indianMuseum,
    rating: 4.4,
    reviewCount: '4.1k',
    eyebrow: 'Oldest Museum in India',
    locationLabel: 'Kolkata',
    description:
      'Founded in 1814, home to a celebrated Egyptian mummy, fossils and Indian art galleries.',
    ticketPrice: 50,
    ticketLabel: '₹50',
    timings: '10:00 AM – 5:00 PM (closed Mon)',
    distanceKm: 1450,
    lat: 22.5576,
    lng: 88.351,
  },
  {
    id: 'csmv-mumbai',
    name: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya',
    state: 'Maharashtra',
    city: 'Mumbai',
    category: 'Museum',
    categories: ['museums'],
    image: IMG.chhatrapati,
    rating: 4.6,
    reviewCount: '8.3k',
    eyebrow: 'Indus Valley Collection',
    locationLabel: 'Mumbai',
    description:
      'Indo-Saracenic museum with sculpture, miniature painting and natural history collections.',
    ticketPrice: 150,
    ticketLabel: '₹150',
    timings: '10:00 AM – 6:00 PM (closed Mon)',
    distanceKm: 1310,
    lat: 18.9269,
    lng: 72.8324,
  },
  {
    id: 'albert-hall',
    name: 'Albert Hall Museum',
    state: 'Rajasthan',
    city: 'Jaipur',
    category: 'Museum',
    categories: ['museums'],
    image: IMG.albertHall,
    rating: 4.6,
    reviewCount: '9.6k',
    eyebrow: 'Indo-Saracenic',
    locationLabel: 'Jaipur',
    description:
      'Oldest museum in Rajasthan, with an Egyptian mummy and a rich collection of Rajasthani art.',
    ticketPrice: 150,
    ticketLabel: '₹150',
    timings: '9:00 AM – 5:00 PM',
    distanceKm: 3.6,
    lat: 26.9107,
    lng: 75.8035,
  },
  {
    id: 'salar-jung',
    name: 'Salar Jung Museum',
    state: 'Telangana',
    city: 'Hyderabad',
    category: 'Museum',
    categories: ['museums'],
    image: IMG.salarJung,
    rating: 4.5,
    reviewCount: '6.8k',
    eyebrow: 'Private Collection',
    locationLabel: 'Hyderabad',
    description:
      'One of India’s largest private collections, with the famous Veiled Rebecca marble statue.',
    ticketPrice: 50,
    ticketLabel: '₹50',
    timings: '10:00 AM – 5:00 PM (closed Fri)',
    distanceKm: 1560,
    lat: 17.3599,
    lng: 78.4489,
  },

  // ---------------------------------------------------------------- Nature
  {
    id: 'valley-of-flowers',
    name: 'Valley of Flowers',
    state: 'Uttarakhand',
    city: 'Chamoli',
    category: 'Nature',
    categories: ['nature', 'unesco'],
    image: IMG.valleyFlowers,
    rating: 4.7,
    reviewCount: '5.2k',
    isUnesco: true,
    eyebrow: 'UNESCO Biosphere',
    badge: 'UNESCO Site',
    locationLabel: 'Chamoli',
    description:
      'Alpine valley carpeted with endemic wildflowers beneath the Nanda Devi and Nar Parvat peaks.',
    ticketPrice: 150,
    ticketLabel: '₹150',
    timings: '7:00 AM – 2:00 PM (Jun–Sep)',
    distanceKm: 380,
    lat: 30.7281,
    lng: 79.6081,
  },
  {
    id: 'kaziranga',
    name: 'Kaziranga National Park',
    state: 'Assam',
    city: 'Nagaon',
    category: 'Nature',
    categories: ['nature', 'unesco'],
    image: IMG.kaziranga,
    rating: 4.7,
    reviewCount: '7.8k',
    isUnesco: true,
    eyebrow: 'UNESCO World Heritage',
    badge: 'UNESCO Site',
    locationLabel: 'Assam',
    description:
      'Floodplain grassland famed for two-thirds of the world’s great one-horned rhinoceroses.',
    ticketPrice: 950,
    ticketLabel: '₹950',
    timings: '6:30 AM – 4:00 PM',
    distanceKm: 1750,
    lat: 26.5774,
    lng: 93.2119,
  },
  {
    id: 'gir-national-park',
    name: 'Gir National Park',
    state: 'Gujarat',
    city: 'Junagadh',
    category: 'Nature',
    categories: ['nature'],
    image: IMG.gir,
    rating: 4.6,
    reviewCount: '4.9k',
    eyebrow: 'Asiatic Lion Habitat',
    locationLabel: 'Gujarat',
    description:
      'The only natural home of the Asiatic lion, a dry deciduous forest and river ecosystem.',
    ticketPrice: 1000,
    ticketLabel: '₹1,000',
    timings: '6:00 AM – 12:00 PM / 3:00 PM – 6:00 PM',
    distanceKm: 1040,
    lat: 21.1245,
    lng: 70.8195,
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans National Park',
    state: 'West Bengal',
    city: 'South 24 Parganas',
    category: 'Nature',
    categories: ['nature', 'unesco'],
    image: IMG.sundarbans,
    rating: 4.5,
    reviewCount: '3.7k',
    isUnesco: true,
    eyebrow: 'Mangrove Delta',
    badge: 'UNESCO Site',
    locationLabel: 'West Bengal',
    description:
      'Largest mangrove forest on Earth and a Bengal tiger reserve threaded by tidal waterways.',
    ticketPrice: 500,
    ticketLabel: '₹500',
    timings: '7:00 AM – 5:00 PM',
    distanceKm: 1620,
    lat: 21.9497,
    lng: 88.8978,
  },
  {
    id: 'western-ghats',
    name: 'Western Ghats',
    state: 'Maharashtra',
    city: 'Pune',
    category: 'Nature',
    categories: ['nature', 'unesco'],
    image: IMG.westernGhats,
    rating: 4.6,
    reviewCount: '6.4k',
    isUnesco: true,
    eyebrow: 'Biodiversity Hotspot',
    badge: 'UNESCO Site',
    locationLabel: 'Maharashtra',
    description:
      'Ancient mountain chain with montane forests, waterfalls and an extraordinary range of endemic species.',
    ticketPrice: 0,
    ticketLabel: 'Free Entry',
    timings: 'Sunrise – Sunset',
    distanceKm: 1150,
    lat: 18.5586,
    lng: 73.7433,
  },
  {
    id: 'radhanagar-beach',
    name: 'Radhanagar Beach',
    state: 'Andaman & Nicobar',
    city: 'Havelock Island',
    category: 'Nature',
    categories: ['nature'],
    image: IMG.andaman,
    rating: 4.8,
    reviewCount: '8.9k',
    eyebrow: 'Island Paradise',
    locationLabel: 'Andaman',
    description:
      'Curving white-sand beach on Havelock Island, regularly ranked among Asia’s finest.',
    ticketPrice: 0,
    ticketLabel: 'Free Entry',
    timings: 'Sunrise – Sunset',
    distanceKm: 1900,
    lat: 11.9761,
    lng: 93.0125,
  },
];

export const featuredMonuments: Monument[] = allMonuments.filter(
  (monument) => monument.id === 'amber-fort',
);

export const popularMonuments: Monument[] = [
  'hawa-mahal',
  'qutub-minar',
  'taj-mahal',
  'mysore-palace',
].map((id) => allMonuments.find((monument) => monument.id === id)!);

export const exploreMonuments: Monument[] = allMonuments;

export const monumentDetails: Record<string, MonumentDetail> = {
  'amber-fort': {
    dynasty: 'Kachwaha Dynasty • 1592 CE',
    address: 'Devisinghpura, Amer, Jaipur, Rajasthan 302001',
    reviewCount: '18,420 reviews',
    heroImage: IMG.amberFort,
    galleryImage: IMG.jaigarh,
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

/** Ids of monuments belonging to a category. UNESCO is a flag, not exclusive. */
export function monumentsInCategory(category: CategoryId): Monument[] {
  return allMonuments.filter((monument) => {
    if (category === 'unesco') {
      return Boolean(monument.isUnesco);
    }
    return monument.categories.includes(category);
  });
}

/** Distinct states, sorted, for state filter menus. */
export const monumentStates: string[] = Array.from(
  new Set(allMonuments.map((monument) => monument.state)),
).sort();

/** Filter helper shared by Home and Explore. */
export type MonumentFilters = {
  categoryId?: CategoryId;
  state?: string | null;
  search?: string;
  minRating?: number;
  maxTicket?: number;
};

/** Filter an arbitrary list (e.g. monuments fetched via React Query). */
export function filterMonumentList(
  monuments: Monument[],
  filters: MonumentFilters,
): Monument[] {
  const { categoryId, state, search, minRating, maxTicket } = filters;
  const query = (search ?? '').trim().toLowerCase();

  return monuments.filter((monument) => {
    if (categoryId && categoryId !== 'unesco') {
      if (!monument.categories.includes(categoryId)) {
        return false;
      }
    }
    if (categoryId === 'unesco' && !monument.isUnesco) {
      return false;
    }
    if (state && monument.state !== state) {
      return false;
    }
    if (minRating !== undefined && monument.rating < minRating) {
      return false;
    }
    if (maxTicket !== undefined && monument.ticketPrice > maxTicket) {
      return false;
    }
    if (query) {
      const haystack = [
        monument.name,
        monument.state,
        monument.city,
        monument.category,
        monument.eyebrow ?? '',
        ...(monument.categories ?? []),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    return true;
  });
}

/** Convenience wrapper over the seed list for legacy/seed consumers. */
export function filterMonuments(filters: MonumentFilters): Monument[] {
  return filterMonumentList(allMonuments, filters);
}