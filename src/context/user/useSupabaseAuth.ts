
import { useEffect } from 'react';
import { User } from './types';
import { supabase } from '../../services/supabase';

export const useSupabaseAuth = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data?.session?.user) {
          // User is logged in
          const userData = await supabase.from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (userData.data) {
            setUser({
              id: data.session.user.id,
              email: data.session.user.email,
              username: userData.data.username || data.session.user.email?.split('@')[0] || 'مستخدم',
              points: userData.data.points || 0,
              cashNumber: userData.data.cash_number || '',
              lastPlayedQuiz: userData.data.last_played_quiz || {},
              showPromotion: userData.data.show_promotion !== false
            });
          } else {
            // Create profile if it doesn't exist
            const username = data.session.user.email?.split('@')[0] || 'مستخدم';
            await supabase.from('profiles').insert({
              id: data.session.user.id,
              username: username,
              points: 0,
              cash_number: '',
              last_played_quiz: {},
              show_promotion: true
            });
            
            setUser({
              id: data.session.user.id,
              email: data.session.user.email,
              username: username,
              points: 0,
              cashNumber: '',
              lastPlayedQuiz: {},
              showPromotion: true
            });
          }
        } else {
          // No session, but we'll continue with anonymous login
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const userData = await supabase.from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userData.data) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              username: userData.data.username || session.user.email?.split('@')[0] || 'مستخدم',
              points: userData.data.points || 0,
              cashNumber: userData.data.cash_number || '',
              lastPlayedQuiz: userData.data.last_played_quiz || {},
              showPromotion: userData.data.show_promotion !== false
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading]);
};
