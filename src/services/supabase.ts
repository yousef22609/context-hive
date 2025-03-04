import { createClient } from '@supabase/supabase-js';

// These should be replaced with the actual values from your Supabase project
const supabaseUrl = 'https://oydloxplqpjkzwarkgmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95ZGxveHBscXBqa3p3YXJrZ21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg4ODc2NzAsImV4cCI6MjAyNDQ2MzY3MH0.s4-6R4H1qDa2HhKEeAvrO8OGFDPDKibf2L6kW_Z1tJ4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User profile type
export interface UserProfile {
  id: string;
  username: string;
  points: number;
  cash_number: string;
  avatar?: string;
  last_played_quiz?: Record<string, string>;
  show_promotion?: boolean;
}

// Function to get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

// Function to update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId);
    
  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  
  return true;
};
