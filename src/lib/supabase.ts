
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Get Supabase credentials with fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if URL and key are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;
if (!isSupabaseConfigured) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
  toast.error('Supabase not configured. Please check your environment variables.');
}

// Create client with proper configuration
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: localStorage
      }
    })
  : null;

// Helper function to check if Supabase is properly configured
export const isSupabaseAvailable = () => {
  return !!supabase;
};
