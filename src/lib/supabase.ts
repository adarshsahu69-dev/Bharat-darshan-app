// react-native-url-polyfill/auto must run before any URL usage so the
// supabase-js client works on React Native (its fetch implementation needs a
// URL polyfill that is not present in the RN runtime).
import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

/**
 * Supabase client.
 *
 * Only the ANON key is used here — it is safe to ship. The service_role key
 * must never be bundled into the app. Row-level security enforces that even
 * the anon key cannot write to the tables.
 */
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string | undefined;
const supabaseAnonKey = Constants.expoConfig?.extra
  ?.supabaseAnonKey as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase credentials are missing. Set EXPO_PUBLIC_SUPABASE_URL and ' +
      'EXPO_PUBLIC_SUPABASE_ANON_KEY in .env (see README.md).',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    detectSessionInUrl: false,
  },
});