import { Component, ReactNode, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MapCanvas } from '@/components/MapCanvas';
import {
  MapCategoryId,
  MapPin,
  mapCategories,
  mapPins,
} from '@/data/map';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * React Native Maps is loaded through NativeMapCanvas, which is itself lazily
 * required only on native platforms. This keeps the web bundle (and static
 * export) free of the native map module, which has no web implementation and
 * throws `codegenNativeComponent is not a function` when evaluated.
 */
type NativeMapCanvasComponent = React.ComponentType<{
  categories: typeof mapCategories;
  activeCategory: MapCategoryId;
  onSelectCategory: (id: MapCategoryId) => void;
  pins: MapPin[];
  selectedPinId: string;
  onSelectPin: (pin: MapPin) => void;
  saved: boolean;
  onToggleSave: () => void;
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
  const [activeCategory, setActiveCategory] = useState<MapCategoryId>('all');
  const [selectedPinId, setSelectedPinId] = useState('amber-fort');
  const [saved, setSaved] = useState(true);

  const visiblePins = useMemo(
    () =>
      activeCategory === 'all'
        ? mapPins
        : mapPins.filter((pin) => pin.category === activeCategory),
    [activeCategory],
  );

  const NativeMap = getNativeMap();

  if (NativeMap) {
    return (
      <MapBoundary>
        <NativeMap
          categories={mapCategories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          pins={visiblePins}
          selectedPinId={selectedPinId}
          onSelectPin={(pin: MapPin) => setSelectedPinId(pin.id)}
          saved={saved}
          onToggleSave={() => setSaved((value) => !value)}
        />
      </MapBoundary>
    );
  }

  return (
    <View style={styles.root}>
      <MapCanvas
        categories={mapCategories}
        activeId={activeCategory}
        onSelect={setActiveCategory}
        pins={visiblePins}
        selectedPinId={selectedPinId}
        onSelectPin={(pin) => setSelectedPinId(pin.id)}
        saved={saved}
        onToggleSave={() => setSaved((value) => !value)}
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

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallback}>
          <Text style={{ color: '#211A15' }}>Map unavailable on this platform.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});