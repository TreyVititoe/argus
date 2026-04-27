import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (Constants.expoConfig?.extra as { supabaseUrl?: string } | undefined)?.supabaseUrl ??
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  // Throw at import time so missing config is loud instead of producing
  // confusing 401s later. EXPO_PUBLIC_SUPABASE_ANON_KEY must be set in
  // mobile/.env.local (see mobile/README.md).
  console.warn(
    "Supabase config missing. Set EXPO_PUBLIC_SUPABASE_ANON_KEY in mobile/.env.local."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const ALLOWED_DOMAINS: Record<string, string> = {
  "cohesity.com": "cohesity",
  "treyvititoe.com": "cohesity",
};

export function tenantForEmail(email: string): string | null {
  const m = email.trim().toLowerCase().match(/@([a-z0-9.-]+)$/);
  if (!m) return null;
  return ALLOWED_DOMAINS[m[1]] ?? null;
}
