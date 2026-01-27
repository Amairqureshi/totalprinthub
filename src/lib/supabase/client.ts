import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check if credentials are configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

if (!isSupabaseConfigured && typeof window !== "undefined") {
    console.warn(
        "⚠️ Supabase not configured. Please add credentials to .env.local\n" +
        "See SUPABASE_SETUP.md for instructions."
    );
}

/**
 * Supabase client for client-side operations
 * Uses cookies for session storage (compatible with Next.js SSR)
 */
export const supabase = isSupabaseConfigured
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : createBrowserClient("https://placeholder.supabase.co", "placeholder-key");

/**
 * Database types for type-safe queries
 */
export type UserProfile = {
    id: string;
    email: string;
    phone?: string;
    full_name?: string;
    medusa_customer_id?: string;
    created_at: string;
    last_login: string;
    updated_at: string;
};

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseReady = () => isSupabaseConfigured;
