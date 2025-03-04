
import { useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { User } from './types';

export const useSupabaseAuth = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        try {
          console.log("Supabase session found, fetching user profile:", session.user.id);
          // Get user profile from database
          const { data: userProfile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (userProfile) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              username: userProfile.username,
              points: userProfile.points || 0,
              cashNumber: userProfile.cash_number || '',
              avatar: userProfile.avatar,
              lastPlayedQuiz: userProfile.last_played_quiz || {},
              showPromotion: userProfile.show_promotion
            });
          } else {
            console.error("User profile not found in database");
            await supabase.auth.signOut();
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        try {
          const { data: userProfile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (userProfile) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              username: userProfile.username,
              points: userProfile.points || 0,
              cashNumber: userProfile.cash_number || '',
              avatar: userProfile.avatar,
              lastPlayedQuiz: userProfile.last_played_quiz || {},
              showPromotion: userProfile.show_promotion
            });
          }
        } catch (error) {
          console.error("Error in auth state change:", error);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading]);
};
