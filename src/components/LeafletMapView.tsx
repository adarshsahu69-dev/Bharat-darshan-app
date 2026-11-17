import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export type LeafletPin = {
  id: string;
  lat: number;
  lng: number;
  color: string;
};

export type LeafletMapHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  locate: (lat: number, lng: number, zoom?: number) => void;
  focus: (lat: number, lng: number, zoom?: number) => void;
};

type Props = {
  pins: LeafletPin[];
  selectedId: string;
  onSelect: (id: string) => void;
  onReady?: () => void;
};

/**
 * Full-screen Leaflet map rendered inside a WebView with OpenStreetMap tiles.
 *
 * This needs no API key, which is why it is used on Android (react-native-maps
 * with the default provider needs a Google Maps key and renders a blank surface
 * without one). Markers are colour-coded circles; tapping one posts a message
 * back to React Native so the preview card can update.
 */
const HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; background: #e9dfce; }
  .leaflet-container { background: #e9dfce; font-family: -apple-system, Roboto, sans-serif; }
  .leaflet-control-attribution { font-size: 9px; }
  .leaflet-tooltip { font-size: 11px; }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
<script>
  var map = L.map('map', { zoomControl: false, attributionControl: true }).setView([22.5, 79], 5);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  var markerLayer = L.layerGroup().addTo(map);

  function post(msg) {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(msg));
    }
  }

  function bdRender(pins, selectedId) {
    markerLayer.clearLayers();
    (pins || []).forEach(function (p) {
      var selected = p.id === selectedId;
      var marker = L.circleMarker([p.lat, p.lng], {
        radius: selected ? 11 : 7,
        color: '#ffffff',
        weight: selected ? 3 : 2,
        fillColor: p.color,
        fillOpacity: 1
      });
      marker.on('click', function () { post({ type: 'select', id: p.id }); });
      marker.addTo(markerLayer);
    });
  }

  window.bdRender = bdRender;
  window.bdZoom = function (delta) { map.setZoom(map.getZoom() + delta); };
  window.bdLocate = function (lat, lng, zoom) { map.setView([lat, lng], zoom || 5); };
  window.bdFocus = function (lat, lng, zoom) { map.setView([lat, lng], zoom || 13); };

  post({ type: 'ready' });
</script>
</body>
</html>`;

export const LeafletMapView = forwardRef<LeafletMapHandle, Props>(
  function LeafletMapView({ pins, selectedId, onSelect, onReady }, ref) {
    // react-native-webview ships its own class type; `any` keeps the ref and the
    // imperative handle ergonomic across its generic signature.
    const webRef = useRef<any>(null);
    const [ready, setReady] = useState(false);

    const renderScript = useMemo(
      () =>
        `window.bdRender && window.bdRender(${JSON.stringify(
          pins,
        )}, ${JSON.stringify(selectedId)}); true;`,
      [pins, selectedId],
    );

    useEffect(() => {
      if (ready) {
        webRef.current?.injectJavaScript(renderScript);
      }
    }, [ready, renderScript]);

    useImperativeHandle(
      ref,
      () => ({
        zoomIn: () =>
          webRef.current?.injectJavaScript('window.bdZoom && window.bdZoom(1); true;'),
        zoomOut: () =>
          webRef.current?.injectJavaScript('window.bdZoom && window.bdZoom(-1); true;'),
        locate: (lat, lng, zoom) =>
          webRef.current?.injectJavaScript(
            `window.bdLocate && window.bdLocate(${lat}, ${lng}, ${zoom ?? 5}); true;`,
          ),
        focus: (lat, lng, zoom) =>
          webRef.current?.injectJavaScript(
            `window.bdFocus && window.bdFocus(${lat}, ${lng}, ${zoom ?? 13}); true;`,
          ),
      }),
      [],
    );

    const handleMessage = (event: { nativeEvent: { data: string } }) => {
      try {
        const message = JSON.parse(event.nativeEvent.data);
        if (message.type === 'ready') {
          setReady(true);
          onReady?.();
        } else if (message.type === 'select' && typeof message.id === 'string') {
          onSelect(message.id);
        }
      } catch {
        /* ignore malformed messages */
      }
    };

    return (
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html: HTML, baseUrl: 'https://bharatdarshan.local' }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        mixedContentMode="always"
        style={styles.webview}
        containerStyle={styles.webview}
      />
    );
  },
);

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#e9dfce',
  },
});