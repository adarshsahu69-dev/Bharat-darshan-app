import { Component, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MapCanvas } from '@/components/MapCanvas';
import {
  buildMapCategories,
  buildMapPins,
  buildMapPreviews,
  MapCategory,
  MapCategoryId,
  MapPin,
  MapPreview,
} from '@/data/map';
import { useMonuments } from '@/data/useMonuments';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * React Native Maps is loaded lazily (never on web) because it has no web
 * implementation and throws when evaluated by the web bundler.
 */
type NativeMapCanvasComponent = React.ComponentType<{
  categories: MapCategory[];
  activeCategory: MapCategoryId;
  onSelectCategory: (id: MapCategoryId) => void;
  pins: MapPin[];
  selectedPinId: string;
  onSelectPin: (pin: MapPin) => void;
  saved: boolean;
  onToggleSave: () => void;
  previewByMonument?: Record<string, MapPreview>;
  defaultPreview?: MapPreview | null;
}>;

let cachedNativeMap: NativeMapCanvasComponent | null = null;
function getNativeMap(): NativeMapCanvasComponent | null {
  if (cachedNativeMap) {
    return cachedNativeMap;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@/components/NativeMapCanvas');
    cachedNativeMap = mod.NativeMapCanvas as NativeMapCanvasComponent;
    return cachedNativeMap;
  } catch {
    return null;
  }
}

export default function MapScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [activeCategory, setActiveCategory] = useState<MapCategoryId>('all');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [saved, setSaved] = useState(true);

  // React Query owns loading, caching and retry for monument data.
  const { data: monuments, isPending, isError, error, refetch } =
    useMonuments();

  const categories = useMemo(
    () => buildMapCategories(monuments ?? []),
    [monuments],
  );
  const allPins = useMemo(() => buildMapPins(monuments ?? []), [monuments]);
  const { previewByMonument, defaultPreview } = useMemo(
    () => buildMapPreviews(monuments ?? []),
    [monuments],
  );

  const visiblePins = useMemo(
    () =>
      activeCategory === 'all'
        ? allPins
        : allPins.filter((pin) => pin.category === activeCategory),
    [activeCategory, allPins],
  );

  // Keep selection valid when data or filter changes.
  useEffect(() => {
    if (visiblePins.length === 0) {
      setSelectedPinId(null);
      return;
    }
    setSelectedPinId((current) => {
      if (current && visiblePins.some((pin) => pin.id === current)) {
        return current;
      }
      return visiblePins[0].id;
    });
  }, [visiblePins]);

  if (isPending) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text
          style={[
            theme.typography.bodyMd,
            { color: theme.colors.onSurfaceVariant, textAlign: 'center' },
          ]}
        >
          {(error as Error)?.message ?? 'Failed to load map data.'}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retry loading map"
          onPress={() => refetch()}
          style={({ pressed }) => [
            styles.retryButton,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text
            style={[
              theme.typography.labelMdStrong,
              { color: theme.colors.onPrimary },
            ]}
          >
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  if (allPins.length === 0) {
    return (
      <View style={styles.centered}>
        <Text
          style={[
            theme.typography.headlineSm,
            { color: theme.colors.secondary, textAlign: 'center' },
          ]}
        >
          No sites on the map yet
        </Text>
        <Text
          style={[
            theme.typography.bodyMd,
            { color: theme.colors.onSurfaceVariant, textAlign: 'center' },
          ]}
        >
          Heritage sites will appear here once they are available.
        </Text>
      </View>
    );
  }

  const effectiveSelectedId = selectedPinId ?? visiblePins[0]?.id ?? allPins[0].id;

  const sharedProps = {
    categories,
    pins: visiblePins,
    selectedPinId: effectiveSelectedId,
    onSelectPin: (pin: MapPin) => setSelectedPinId(pin.id),
    saved,
    onToggleSave: () => setSaved((value) => !value),
    previewByMonument,
    defaultPreview,
  } as const;

  if (Platform.OS === 'web') {
    return (
      <View style={styles.root}>
        <MapCanvas
          activeId={activeCategory}
          onSelect={setActiveCategory}
          {...sharedProps}
        />
      </View>
    );
  }

  const NativeMap = getNativeMap();

  if (NativeMap) {
    return (
      <MapBoundary>
        <NativeMap
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          {...sharedProps}
        />
      </MapBoundary>
    );
  }

  // Last-resort fallback if the native module failed to load.
  return (
    <View style={styles.root}>
      <MapCanvas
        activeId={activeCategory}
        onSelect={setActiveCategory}
        {...sharedProps}
      />
    </View>
  );
}

class MapBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.warn('[map] MapBoundary caught error:', error?.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Map unavailable on this platform.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.page,
      backgroundColor: theme.colors.background,
      gap: theme.spacing.md,
    },
    retryButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}