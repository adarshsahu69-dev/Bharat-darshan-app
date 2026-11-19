import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MapCategoryChips } from '@/components/MapCategoryChips';
import { MapPreviewSheet } from '@/components/MapPreviewSheet';
import { SearchBar } from '@/components/SearchBar';
import { MAP_TILE_URL_DARK, MAP_TILE_URL_LIGHT } from '@/constants/mapTiles';
import {
  defaultPreview as seedDefaultPreview,
  mapInitialRegion,
  MapCategory,
  MapCategoryId,
  MapPin,
  MapPreview,
  mapPreviewByMonument as seedPreviewByMonument,
} from '@/data/map';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  categories: MapCategory[];
  activeCategory: MapCategoryId;
  onSelectCategory: (id: MapCategoryId) => void;
  pins: MapPin[];
  selectedPinId: string;
  onSelectPin: (pin: MapPin) => void;
  saved: boolean;
  onToggleSave: () => void;
  /** Preview lookup built from fetched data; falls back to seed data. */
  previewByMonument?: Record<string, MapPreview>;
  defaultPreview?: MapPreview | null;
};

/**
 * Native map implementation. Only required on native platforms (see
 * app/(tabs)/map.tsx); react-native-maps has no web implementation.
 */
export function NativeMapCanvas({
  categories,
  activeCategory,
  onSelectCategory,
  pins,
  selectedPinId,
  onSelectPin,
  saved,
  onToggleSave,
  previewByMonument,
  defaultPreview,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [query, setQuery] = useState('');
  const lastFitKeyRef = useRef<string | null>(null);

  const tileUrl =
    theme.scheme === 'dark' ? MAP_TILE_URL_DARK : MAP_TILE_URL_LIGHT;

  const displayedPins = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return pins;
    }
    return pins.filter((pin) => {
      const haystack = `${pin.name} ${pin.city} ${pin.state}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [pins, query]);

  const selectedPin =
    displayedPins.find((pin) => pin.id === selectedPinId) ?? displayedPins[0];
  const previews = previewByMonument ?? seedPreviewByMonument;
  const fallbackPreview = defaultPreview ?? seedDefaultPreview;
  const preview = selectedPin
    ? (previews[selectedPin.monumentId] ?? fallbackPreview)
    : fallbackPreview;

  const fitKey = `${activeCategory}|${query.trim().toLowerCase()}|${displayedPins
    .map((pin) => pin.id)
    .join(',')}`;

  useEffect(() => {
    // Keep the initial Jaipur/Amer region on first render; fit when filters change.
    if (lastFitKeyRef.current === null) {
      lastFitKeyRef.current = fitKey;
      return;
    }
    if (lastFitKeyRef.current === fitKey) {
      return;
    }
    lastFitKeyRef.current = fitKey;

    if (displayedPins.length === 0) {
      return;
    }

    if (displayedPins.length === 1) {
      const [pin] = displayedPins;
      mapRef.current?.animateToRegion(
        {
          latitude: pin.latitude,
          longitude: pin.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        },
        350,
      );
      return;
    }

    mapRef.current?.fitToCoordinates(
      displayedPins.map((pin) => ({
        latitude: pin.latitude,
        longitude: pin.longitude,
      })),
      {
        edgePadding: { top: 180, right: 60, bottom: 360, left: 60 },
        animated: true,
      },
    );
  }, [displayedPins, fitKey]);

  const focusPin = (pin: MapPin) => {
    onSelectPin(pin);
    mapRef.current?.animateToRegion(
      {
        latitude: pin.latitude,
        longitude: pin.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      350,
    );
  };

  const zoom = (direction: 1 | -1) => {
    mapRef.current?.getCamera().then((camera) => {
      const nextZoom = Math.min(
        20,
        Math.max(2, (camera.zoom ?? 14) + direction),
      );
      mapRef.current?.animateCamera({ zoom: nextZoom }, { duration: 250 });
    });
  };

  const openPreview = () => {
    if (preview) {
      router.push(`/monument/${preview.monumentId}`);
    }
  };

  return (
    <View style={styles.root}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={mapInitialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        toolbarEnabled={false}
        mapType="none"
        onMapReady={() => {
          // eslint-disable-next-line no-console
          console.log('[map] onMapReady');
        }}
      >
        {/* CARTO raster basemap tiles (theme-aware) over a blank base map. */}
        <UrlTile
          urlTemplate={tileUrl}
          zIndex={-1}
          maximumZ={19}
        />

        {displayedPins.map((pin) => {
          const selected = pin.id === selectedPin?.id;
          return (
            <Marker
              key={pin.id}
              coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
              onPress={() => focusPin(pin)}
            >
              <View style={styles.markerColumn}>
                {selected ? (
                  <View style={styles.markerLabel}>
                    <MaterialIcons
                      name="star"
                      size={10}
                      color={theme.colors.gold}
                    />
                    <Text
                      style={[
                        theme.typography.labelSm,
                        { color: theme.colors.onImage },
                      ]}
                    >
                      {pin.name}
                    </Text>
                  </View>
                ) : null}
                <View
                  style={[
                    styles.markerPin,
                    selected && styles.markerPinActive,
                    { backgroundColor: categoryColor(theme, pin.category) },
                  ]}
                >
                  <MaterialIcons
                    name={categoryIcon(pin.category)}
                    size={selected ? 20 : 16}
                    color={theme.colors.onImage}
                  />
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <Text style={styles.attribution}>© OpenStreetMap contributors © CARTO</Text>

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
          label="Re-center location"
          size="large"
          onPress={() => mapRef.current?.animateToRegion(mapInitialRegion, 350)}
        />
        <MapIconButton icon="add" label="Zoom in" onPress={() => zoom(1)} />
        <MapIconButton icon="remove" label="Zoom out" onPress={() => zoom(-1)} />
      </View>

      {preview ? (
        <View style={[styles.bottomSheet, { bottom: insets.bottom + 76 }]}>
          <MapPreviewSheet
            preview={preview}
            saved={saved}
            onToggleSave={onToggleSave}
            onViewDetails={openPreview}
          />
        </View>
      ) : null}
    </View>
  );
}

function categoryColor(
  theme: ReturnType<typeof useTheme>,
  category: MapPin['category'],
): string {
  if (category === 'temples') {
    return theme.colors.gold;
  }
  if (category === 'palaces') {
    return theme.colors.secondary;
  }
  return theme.colors.primary;
}

function categoryIcon(category: MapPin['category']) {
  if (category === 'temples') {
    return 'temple-hindu' as const;
  }
  if (category === 'palaces') {
    return 'account-balance' as const;
  }
  return 'castle' as const;
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
    markerColumn: {
      alignItems: 'center',
    },
    markerLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 4,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.secondary,
      borderWidth: 1,
      borderColor: theme.colors.goldSoft,
      marginBottom: 4,
    },
    markerPin: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.onImage,
    },
    markerPinActive: {
      width: 40,
      height: 40,
      borderRadius: 20,
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
    attribution: {
      position: 'absolute',
      left: 8,
      bottom: 4,
      fontSize: 9,
      color: theme.colors.onSurface,
      backgroundColor: `${theme.colors.surface}CC`,
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 3,
    },
  });
}