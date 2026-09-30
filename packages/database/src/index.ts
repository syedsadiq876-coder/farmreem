// Supabase Client Utilities & Database Contracts

export interface DatabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey?: string;
}

export function getDatabaseConfig(): DatabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  return {
    supabaseUrl: url,
    supabaseAnonKey: key,
    supabaseServiceKey: serviceKey,
  };
}
