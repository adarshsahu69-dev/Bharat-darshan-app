import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  LeafletMapHandle,
  LeafletMapView,
  LeafletPin,
} from '@/components/LeafletMapView';
import { MapCategoryChips } from '@/components/MapCategoryChips';
import { MapPreviewSheet } from '@/components/MapPreviewSheet';
import { SearchBar } from '@/components/SearchBar';
import {
  defaultPreview,
  mapCategories,
  mapInitialRegion,
  MapCategoryId,
  MapPin,
  mapPreviewByMonument,
} from '@/data/map';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  categories: typeof mapCategories;
  activeCategory: MapCategoryId;
  onSelectCategory: (id: MapCategoryId) => void;
  pins: MapPin[];
  selectedPinId: string;
  onSelectPin: (pin: MapPin) => void;
  saved: boolean;
  onToggleSave: () => void;
};

/**
 * Native map canvas backed by a Leaflet + OpenStreetMap WebView.
 *
 * Used on Android, where react-native-maps' default (Google) provider renders a
 * blank surface without an API key. Leaflet needs no key and always shows tiles.
 */
export function LeafletMapCanvas({
  categories,
  activeCategory,
  onSelectCategory,
  pins,
  selectedPinId,
  onSelectPin,
  saved,
  onToggleSave,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<LeafletMapHandle>(null);
  const [query, setQuery] = useState('Amber Fort, Amer');

  const leafletPins: LeafletPin[] = useMemo(
    () =>
      pins.map((pin) => ({
        id: pin.id,
        lat: pin.latitude,
        lng: pin.longitude,
        color: categoryColor(theme, pin.category),
      })),
    [pins, theme],
  );

  const selectedPin =
    pins.find((pin) => pin.id === selectedPinId) ?? pins[0] ?? mapPinsFallback;
  const preview =
    mapPreviewByMonument[selectedPin.monumentId] ?? defaultPreview;

  const openPreview = () => {
    router.push(`/monument/${preview.monumentId}`);
  };

  return (
    <View style={styles.root}>
      <LeafletMapView
        ref={mapRef}
        pins={leafletPins}
        selectedId={selectedPinId}
        onSelect={(id) => {
          const pin = pins.find((item) => item.id === id);
          if (pin) {
            onSelectPin(pin);
          }
        }}
      />

      <View
        style={[
          styles.overlayTop,
          { paddingTop: insets.top + theme.spacing.sm },
        ]}
      >
        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              onClear={() => setQuery('')}
              showMic
              compact
              placeholder="Search monuments, cities, or landmarks"
              accessibilityLabel="Search map location"
            />
          </View>
          <MapIconButton icon="layers" label="Map layers" onPress={() => {}} />
        </View>

        <MapCategoryChips
          categories={categories}
          activeId={activeCategory}
          onSelect={onSelectCategory}
        />
      </View>

      <View style={styles.floatingControls}>
        <MapIconButton
          icon="my-location"
          label="Re-center map"
          size="large"
          onPress={() =>
            mapRef.current?.locate(
              mapInitialRegion.latitude,
              mapInitialRegion.longitude,
              5,
            )
          }
        />
        <MapIconButton
          icon="add"
          label="Zoom in"
          onPress={() => mapRef.current?.zoomIn()}
        />
        <MapIconButton
          icon="remove"
          label="Zoom out"
          onPress={() => mapRef.current?.zoomOut()}
        />
      </View>

      <View style={[styles.bottomSheet, { bottom: insets.bottom + 76 }]}>
        <MapPreviewSheet
          preview={preview}
          saved={saved}
          onToggleSave={onToggleSave}
          onViewDetails={openPreview}
        />
      </View>
    </View>
  );
}

// Fallback pin so the preview always resolves even with an empty filter result.
const mapPinsFallback: MapPin = {
  id: 'amber-fort',
  monumentId: 'amber-fort',
  name: 'Amber Fort',
  category: 'forts',
  latitude: 26.9858,
  longitude: 75.8513,
  image: '',
  ticketPrice: 100,
  isUnesco: true,
  rating: 4.9,
  city: 'Jaipur',
  state: 'Rajasthan',
};

function categoryColor(
  theme: ReturnType<typeof useTheme>,
  category: MapPin['category'],
): string {
  switch (category) {
    case 'temples':
      return theme.colors.gold;
    case 'palaces':
      return theme.colors.secondary;
    case 'museums':
      return theme.colors.emerald;
    case 'nature':
      return theme.colors.emerald;
    case 'unesco':
      return theme.colors.gold;
    default:
      return theme.colors.primary;
  }
}

function MapIconButton({
  icon,
  label,
  onPress,
  size = 'normal',
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  size?: 'normal' | 'large';
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        size === 'large' && styles.iconButtonLarge,
        pressed && { opacity: 0.8 },
      ]}
    >
      <MaterialIcons
        name={icon}
        size={size === 'large' ? 22 : 18}
        color={size === 'large' ? theme.colors.primary : theme.colors.secondary}
      />
    </Pressable>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.surfaceContainerHigh,
    },
    overlayTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      paddingHorizontal: theme.spacing.page,
      paddingBottom: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${theme.colors.surface}F0`,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}80`,
      ...theme.shadows.warmSoft,
    },
    iconButtonLarge: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    floatingControls: {
      position: 'absolute',
      right: theme.spacing.page,
      top: 236,
      gap: theme.spacing.sm,
    },
    bottomSheet: {
      position: 'absolute',
      left: 0,
      right: 0,
    },
  });
}