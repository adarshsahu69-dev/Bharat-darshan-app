/**
 * Mock data for the Heritage Map screen.
 * Positions and counts are approximate placeholders; swap for a GeoJSON layer
 * when the data layer is added.
 */

export type MapCategoryId = 'all' | 'forts' | 'temples' | 'palaces';

export type MapCategory = {
  id: MapCategoryId;
  label: string;
  /** Short label shown on the chip. */
  chipLabel: string;
  count: number;
  icon: 'castle' | 'temple-hindu' | 'account-balance' | 'explore';
};

/** Default camera when no search target is active. */
export const mapInitialRegion = {
  latitude: 26.9751,
  longitude: 75.8244,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

export const mapSearchPlaceholder = 'Search monuments, cities, or landmarks';

export const mapCategories: MapCategory[] = [
  { id: 'all', label: 'All Sites', chipLabel: 'All Sites', count: 42, icon: 'explore' },
  { id: 'forts', label: 'Forts', chipLabel: 'Forts', count: 8, icon: 'castle' },
  { id: 'temples', label: 'Temples', chipLabel: 'Temples', count: 14, icon: 'temple-hindu' },
  { id: 'palaces', label: 'Palaces', chipLabel: 'Palaces', count: 6, icon: 'account-balance' },
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
};

export const mapPins: MapPin[] = [
  {
    id: 'amber-fort',
    monumentId: 'amber-fort',
    name: 'Amber Fort',
    category: 'forts',
    latitude: 26.9858,
    longitude: 75.8513,
    isPrimary: true,
  },
  {
    id: 'jaigarh-fort',
    monumentId: 'amber-fort',
    name: 'Jaigarh Fort',
    category: 'forts',
    latitude: 27.0,
    longitude: 75.8534,
  },
  {
    id: 'nahargarh',
    monumentId: 'amber-fort',
    name: 'Nahargarh',
    category: 'forts',
    latitude: 26.9384,
    longitude: 75.8156,
  },
  {
    id: 'jal-mahal',
    monumentId: 'amber-fort',
    name: 'Jal Mahal',
    category: 'palaces',
    latitude: 26.9536,
    longitude: 75.8454,
  },
  {
    id: 'govind-dev-ji',
    monumentId: 'amber-fort',
    name: 'Govind Dev Ji',
    category: 'temples',
    latitude: 26.9924,
    longitude: 75.8229,
  },
  {
    id: 'hawa-mahal',
    monumentId: 'hawa-mahal',
    name: 'Hawa Mahal',
    category: 'palaces',
    latitude: 26.9239,
    longitude: 75.8267,
  },
];

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

export const mapPreviewByMonument: Record<string, MapPreview> = {
  'amber-fort': {
    monumentId: 'amber-fort',
    name: 'Amber Fort & Palace',
    location: 'Amer, Jaipur',
    distanceLabel: '11 km away',
    priceLabel: '₹100 Entry',
    image:
      'https://lh3.googleusercontent.com/aida/ALJJyrAsF40ZXN-v1Vulvw4aG7ozy4xUh0rqhqOFMW886NrUB8-GWJf9jZwEkv-Ajh0PFbQ7zXhxjaw-voWbJKcWJhvVjUH2pm-0EJyjpfM4c-BjVlBoHgYLLJ4bOMmDh1o26k26rnK3ivgSB-o-HPB_KbnJmvzvkGLTViG3L4XzwDRBau4qjDos9RrEdaX7Hb2dEKKcUCx4oTJfCvDBML9UVR_WGyPIUmgC1M2VwfiYFzF7iDrtg1HjyZDRlg',
    rating: 4.9,
    isUnesco: true,
  },
  'hawa-mahal': {
    monumentId: 'hawa-mahal',
    name: 'Hawa Mahal',
    location: 'Pink City, Jaipur',
    distanceLabel: '2.4 km away',
    priceLabel: '₹50 Entry',
    image:
      'https://lh3.googleusercontent.com/aida/ALJJyrDxvgaELk8cAG6h3gEOg1Py7XM4-zXzJgCcnoYXcvP8lCbqltYbdugh3kT1S3SVA48h6J7Ojqs3Umg95lmzYybNJVG5nUt9pAoQD27UN7i2JB7XmpuLLX9N79LUhardPJ7fWeAu5O_j_qRvNlKjEJR-xZbNWkwQIb3q_pBs1uu-nBOHpe6wc3qJUYx-L_OmZGenrJ5hIV74NN4coiRSIL0XL0126-YktNBhoWpoMF8BeYML',
    rating: 4.7,
    isUnesco: false,
  },
};

export const defaultPreview = mapPreviewByMonument['amber-fort'];