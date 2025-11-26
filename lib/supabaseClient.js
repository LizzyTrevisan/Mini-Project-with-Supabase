// lib/supabaseClient.js
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

let client = null;

export function createClient() {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
      );
    }

    client = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  }

  return client;
}
