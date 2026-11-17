import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [query, setQuery] = useState('Amber Fort, Amer');

  const selectedPin = pins.find((pin) => pin.id === selectedPinId) ?? pins[0];
  const preview = mapPreviewByMonument[selectedPin.monumentId] ?? defaultPreview;

  const focusPin = (pin: MapPin) => {
    onSelectPin(pin);
    mapRef.current?.animateToRegion(
      {
        latitude: pin.latitude,
        longitude: pin.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      },
      350,
    );
  };

  const zoom = (direction: 1 | -1) => {
    mapRef.current?.getCamera().then((camera) => {
      const nextZoom = Math.min(20, Math.max(2, (camera.zoom ?? 14) + direction));
      mapRef.current?.animateCamera({ zoom: nextZoom }, { duration: 250 });
    });
  };

  const openPreview = () => {
    if (preview.monumentId === 'amber-fort') {
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
        mapType="standard"
      >
        {pins.map((pin) => {
          const selected = pin.id === selectedPinId;
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
  });
}