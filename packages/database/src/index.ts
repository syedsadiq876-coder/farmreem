// Supabase Client Utilities & Database Contracts

export interface DatabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export function getDatabaseConfig(): DatabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key';
  return {
    supabaseUrl: url,
    supabaseAnonKey: key,
  };
}
