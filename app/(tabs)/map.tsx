import { Component, ReactNode, useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { MapCanvas } from '@/components/MapCanvas';
import {
  MapCategoryId,
  MapPin,
  mapCategories,
  mapPins,
} from '@/data/map';

/**
 * The native map components are required lazily (never on web): react-native-maps
 * has no web implementation and throws `codegenNativeComponent is not a function`
 * when evaluated by the web bundler.
 *
 * Platform choice:
 *  - Android: Leaflet + OpenStreetMap in a WebView. react-native-maps' default
 *    (Google) provider needs an API key and renders a blank surface without one.
 *  - iOS: react-native-maps with UrlTile OpenStreetMap (Apple provider needs no
 *    key).
 *  - Web: the styled MapCanvas fallback.
 */
type NativeCanvasComponent = React.ComponentType<{
  categories: typeof mapCategories;
  activeCategory: MapCategoryId;
  onSelectCategory: (id: MapCategoryId) => void;
  pins: MapPin[];
  selectedPinId: string;
  onSelectPin: (pin: MapPin) => void;
  saved: boolean;
  onToggleSave: () => void;
}>;

let cachedLeaflet: NativeCanvasComponent | null = null;
function getLeafletCanvas(): NativeCanvasComponent | null {
  if (cachedLeaflet) {
    return cachedLeaflet;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@/components/LeafletMapCanvas');
    cachedLeaflet = mod.LeafletMapCanvas as NativeCanvasComponent;
    return cachedLeaflet;
  } catch {
    return null;
  }
}

let cachedNativeMap: NativeCanvasComponent | null = null;
function getNativeMap(): NativeCanvasComponent | null {
  if (cachedNativeMap) {
    return cachedNativeMap;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@/components/NativeMapCanvas');
    cachedNativeMap = mod.NativeMapCanvas as NativeCanvasComponent;
    return cachedNativeMap;
  } catch {
    return null;
  }
}

export default function MapScreen() {
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

  const canvasProps = {
    categories: mapCategories,
    activeCategory,
    onSelectCategory: setActiveCategory,
    pins: visiblePins,
    selectedPinId,
    onSelectPin: (pin: MapPin) => setSelectedPinId(pin.id),
    saved,
    onToggleSave: () => setSaved((value) => !value),
  };

  if (Platform.OS === 'web') {
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

  const Canvas = Platform.OS === 'android' ? getLeafletCanvas() : getNativeMap();

  if (Canvas) {
    return (
      <MapBoundary>
        <Canvas {...canvasProps} />
      </MapBoundary>
    );
  }

  // Last-resort fallback if a native module failed to load.
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

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.warn('[map] MapBoundary caught error:', error?.message);
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