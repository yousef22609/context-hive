
import { useEffect } from 'react';
import { User } from './types';
import { supabase } from '../../services/supabase';

export const useSupabaseAuth = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data?.session?.user) {
          // User is logged in
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (error) throw error;

          if (userData) {
            setUser({
              id: userData.id,
              username: userData.username,
              avatar_url: userData.avatar_url,
              points: userData.total_points || 0,
              created_at: userData.created_at
            });
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
          return;
        }

        if (userData) {
          setUser({
            id: userData.id,
            username: userData.username,
            avatar_url: userData.avatar_url,
            points: userData.total_points || 0,
            created_at: userData.created_at
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [setUser, setLoading]);
};
