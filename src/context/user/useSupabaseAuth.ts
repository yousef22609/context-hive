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
          // No valid session, create a guest user
          const guestId = Math.random().toString(36).substring(2, 15);
          const guestUser: User = {
            id: guestId,
            username: `زائر_${Math.floor(Math.random() * 10000)}`,
            points: 50,
            cashNumber: '',
            lastPlayedQuiz: {},
            showPromotion: true
          };
          
          setUser(guestUser);
          console.log('Created guest user:', guestUser);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        // Create a fallback guest user
        const guestId = Math.random().toString(36).substring(2, 15);
        setUser({
          id: guestId,
          username: `زائر_${Math.floor(Math.random() * 10000)}`,
          points: 50,
          cashNumber: '',
          lastPlayedQuiz: {},
          showPromotion: true
        });
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    
    // Simple mock for auth state change
    return () => {
      // Nothing to clean up with mock client
    };
  }, [setUser, setLoading]);
};
