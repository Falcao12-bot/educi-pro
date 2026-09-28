import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
if (!url || !anon) console.warn('Variables EXPO_PUBLIC_SUPABASE_* manquantes (.env)');

// La clé "anon" est publique par conception : la sécurité repose sur la RLS.
export const supabase = createClient(url || 'http://localhost', anon || 'missing', {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});
