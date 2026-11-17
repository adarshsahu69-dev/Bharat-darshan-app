import { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * Google Maps for Android needs an API key in the native config. Without it,
 * `react-native-maps` still renders tiles on iOS and in Expo Go, but Android
 * release builds will show a blank map until a real key is supplied.
 *
 * Set EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY in `.env` (see .env.example).
 * A placeholder is used here so the app never crashes on a missing value.
 */
const GOOGLE_MAPS_ANDROID_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY ??
  'YOUR_GOOGLE_MAPS_ANDROID_KEY';

export default ({ config }: ConfigContext): ExpoConfig => {
  const base = config as ExpoConfig;

  return {
    ...base,
    android: {
      ...base.android,
      config: {
        ...base.android?.config,
        googleMaps: {
          apiKey: GOOGLE_MAPS_ANDROID_KEY,
        },
      },
    },
  };
};