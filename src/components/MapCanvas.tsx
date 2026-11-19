import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MapCategoryChips } from '@/components/MapCategoryChips';
import { MapPreviewSheet } from '@/components/MapPreviewSheet';
import { SearchBar } from '@/components/SearchBar';
import {
  defaultPreview as seedDefaultPreview,
  mapCategories as seedMapCategories,
  MapCategory,
  MapCategoryId,
  MapPin,
  MapPreview,
  mapPreviewByMonument as seedPreviewByMonument,
} from '@/data/map';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  categories: MapCategory[];
  activeId: MapCategoryId;
  onSelect: (id: MapCategoryId) => void;
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
 * Stylized preview map used when react-native-maps is unavailable (web). It
 * mirrors the native layout so the screen looks the same across platforms.
 */
export function MapCanvas({
  categories,
  activeId,
  onSelect,
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
  const [query, setQuery] = useState('Amber Fort, Amer');

  const selectedPin = pins.find((pin) => pin.id === selectedPinId) ?? pins[0];
  const previews = previewByMonument ?? seedPreviewByMonument;
  const fallbackPreview = defaultPreview ?? seedDefaultPreview;
  const preview = selectedPin
    ? (previews[selectedPin.monumentId] ?? fallbackPreview)
    : fallbackPreview;

  const openPreview = () => {
    if (preview) {
      router.push(`/monument/${preview.monumentId}`);
    }
  };

  const positions = pinPositions(pins.length);

  return (
    <View style={styles.root}>
      <View style={styles.grid} pointerEvents="none">
        <View style={styles.water} />
        <View style={styles.road} />
      </View>

      <View style={styles.top}>
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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Map layers"
            style={({ pressed }) => [
              styles.iconButton,
              pressed && { opacity: 0.8 },
            ]}
          >
            <MaterialIcons
              name="layers"
              size={18}
              color={theme.colors.secondary}
            />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {categories.map((category) => {
            const active = category.id === activeId;
            return (
              <Pressable
                key={category.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${category.label}, ${category.count}`}
                onPress={() => onSelect(category.id)}
                style={({ pressed }) => [
                  styles.chip,
                  active ? styles.chipActive : styles.chipInactive,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <MaterialIcons
                  name={category.icon}
                  size={14}
                  color={active ? theme.colors.onPrimary : theme.colors.primary}
                />
                <Text
                  style={[
                    theme.typography.labelSm,
                    {
                      color: active
                        ? theme.colors.onPrimary
                        : theme.colors.onSurface,
                    },
                  ]}
                >
                  {category.chipLabel} ({category.count})
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.pinLayer} pointerEvents="box-none">
        {pins.map((pin, index) => {
          const selected = pin.id === selectedPinId;
          const { top, left } = positions[index % positions.length];
          return (
            <Pressable
              key={pin.id}
              accessibilityRole="button"
              accessibilityLabel={`${pin.name}${selected ? ', selected' : ''}`}
              onPress={() => onSelectPin(pin)}
              style={({ pressed }) => [
                styles.pin,
                { top: `${top}%`, left: `${left}%` },
                selected && styles.pinSelected,
                pressed && { opacity: 0.85 },
              ]}
            >
              {selected ? (
                <View style={styles.pinLabel}>
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
                    {pin.name} (Selected)
                  </Text>
                </View>
              ) : (
                <View style={styles.pinLabelStatic}>
                  <Text
                    style={[
                      theme.typography.labelSm,
                      { color: theme.colors.secondary },
                    ]}
                  >
                    {pin.name}
                  </Text>
                </View>
              )}
              <View
                style={[
                  styles.pinBubble,
                  { backgroundColor: categoryColor(theme, pin.category) },
                  selected && styles.pinBubbleActive,
                ]}
              >
                <MaterialIcons
                  name={categoryIcon(pin.category)}
                  size={selected ? 20 : 16}
                  color={theme.colors.onImage}
                />
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.floatingControls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Re-center location"
          style={({ pressed }) => [
            styles.iconButtonLarge,
            pressed && { opacity: 0.8 },
          ]}
        >
          <MaterialIcons
            name="my-location"
            size={22}
            color={theme.colors.primary}
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zoom in"
          style={({ pressed }) => [
            styles.iconButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <MaterialIcons name="add" size={18} color={theme.colors.secondary} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zoom out"
          style={({ pressed }) => [
            styles.iconButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <MaterialIcons name="remove" size={18} color={theme.colors.secondary} />
        </Pressable>
      </View>

      {preview ? (
        <View style={styles.sheet}>
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

function pinPositions(count: number): { top: number; left: number }[] {
  const base = [
    { top: 34, left: 50 },
    { top: 24, left: 22 },
    { top: 42, left: 66 },
    { top: 56, left: 24 },
    { top: 30, left: 74 },
    { top: 60, left: 58 },
  ];
  if (count <= base.length) {
    return base;
  }
  return Array.from({ length: count }, (_, index) => base[index % base.length]);
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.surfaceContainerHigh,
    },
    grid: {
      ...StyleSheet.absoluteFill,
      opacity: 0.5,
    },
    water: {
      position: 'absolute',
      left: '42%',
      top: -40,
      bottom: -40,
      width: 26,
      borderRadius: 13,
      backgroundColor: theme.colors.secondary,
      opacity: 0.14,
    },
    road: {
      position: 'absolute',
      left: -20,
      right: -20,
      top: '52%',
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.primary,
      opacity: 0.12,
      transform: [{ rotate: '12deg' }],
    },
    top: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      paddingHorizontal: theme.spacing.page,
      paddingTop: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    chipRow: {
      gap: theme.spacing.sm,
      paddingRight: theme.spacing.page,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: theme.radii.chip,
      borderWidth: 1,
    },
    chipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      ...theme.shadows.warmSoft,
    },
    chipInactive: {
      backgroundColor: `${theme.colors.surface}F5`,
      borderColor: `${theme.colors.outlineVariant}99`,
      ...theme.shadows.warmSoft,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${theme.colors.surface}F5`,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}99`,
      ...theme.shadows.warmSoft,
    },
    iconButtonLarge: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${theme.colors.surface}F5`,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}99`,
      ...theme.shadows.warm,
    },
    pinLayer: {
      ...StyleSheet.absoluteFill,
    },
    pin: {
      position: 'absolute',
      alignItems: 'center',
      marginLeft: -16,
    },
    pinSelected: {
      marginLeft: -20,
    },
    pinLabel: {
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
      ...theme.shadows.warm,
    },
    pinLabelStatic: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radii.xs,
      backgroundColor: `${theme.colors.surface}E6`,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}4D`,
      marginBottom: 2,
    },
    pinBubble: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.onImage,
    },
    pinBubbleActive: {
      width: 40,
      height: 40,
      borderRadius: 20,
      ...theme.shadows.warm,
    },
    floatingControls: {
      position: 'absolute',
      right: theme.spacing.page,
      top: 236,
      gap: theme.spacing.sm,
    },
    sheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 84,
    },
  });
}