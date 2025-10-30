
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Get Supabase credentials with fallback values for development
const supabaseUrl = 'https://vczcrraoupoblbfrjsam.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjemNycmFvdXBvYmxiZnJqc2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTcyMDcsImV4cCI6MjA2MDYzMzIwN30.yir5pFh5XH0fhZrOlbw02AZ6qJLCemcMmb_kTx-e3Cc';

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
      },
      realtime: {
        connectTimeout: 20000 // increase connection timeout
      }
    })
  : null;

// Helper function to check if Supabase is properly configured
export const isSupabaseAvailable = () => {
  return !!supabase;
};
