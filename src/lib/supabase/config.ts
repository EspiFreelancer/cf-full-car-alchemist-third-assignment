// Credentials come only from environment variables (see .env.example). Never hardcode them.
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
}

export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.publishableKey)
