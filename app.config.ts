import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const base = config as ExpoConfig;

  return {
    ...base,
    extra: {
      ...base.extra,
      // Supabase credentials. Read from EXPO_PUBLIC_SUPABASE_URL and
      // EXPO_PUBLIC_SUPABASE_ANON_KEY in .env (see README.md). Only the ANON key
      // is shipped — the service_role key must never be bundled.
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    },
    plugins: ['expo-image'],
  };
};