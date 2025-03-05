
import { createClient } from '@supabase/supabase-js';

// Provide fallback values if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fallback-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZmFsbGJhY2t2YWx1ZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE5NTczMjkyMDB9.dummy_key_for_development';

// Check if keys are invalid
const useRealSupabase = supabaseUrl.includes('.supabase.co') && supabaseAnonKey.length > 20;

// Create a mock Supabase client if real credentials are missing
export const supabase = useRealSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ 
          data: { 
            subscription: { 
              unsubscribe: () => {} 
            } 
          } 
        }),
        signOut: async () => {},
        signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            data: []
          }),
          data: []
        }),
        insert: () => ({
          data: null,
          error: { message: 'Supabase not configured' }
        }),
        update: () => ({
          eq: () => ({
            data: null,
            error: { message: 'Supabase not configured' }
          })
        })
      })
    };

// Show a warning if not using real Supabase
if (!useRealSupabase) {
  console.warn('Using mock Supabase client. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file for real functionality.');
}

export interface UserProfile {
  id: string;
  username: string;
  points: number;
  cash_number: string;
  avatar?: string;
  last_played_quiz?: Record<string, string>;
  show_promotion?: boolean;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // If using mock Supabase, return test profile
    if (!useRealSupabase) {
      return {
        id: userId,
        username: 'زائر_تجريبي',
        points: 150,
        cash_number: '',
        last_played_quiz: {},
        show_promotion: true
      };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    if (!useRealSupabase) {
      console.log('Mock update user profile:', updates);
      return true;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};
