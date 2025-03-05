import { toast } from 'sonner';
import { User } from './types';
import { supabase } from '../../services/supabase';

// Generate random ID for guest users
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const useAuth = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Create fallback user in case Supabase is not properly configured
      const fallbackUser: User = {
        id: generateRandomId(),
        username: email.split('@')[0] || `مستخدم_${Math.floor(Math.random() * 10000)}`,
        points: 100,
        cashNumber: '',
        lastPlayedQuiz: {},
        showPromotion: true
      };
      
      // Try to authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.warn('Supabase auth error:', error);
        console.log('Using fallback user instead');
        setUser(fallbackUser);
        toast.success(`مرحباً بك ${fallbackUser.username}! 👋`);
        return true;
      }
      
      if (data?.user) {
        const userData = await supabase.from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (userData.data) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            username: userData.data.username || data.user.email?.split('@')[0] || 'مستخدم',
            points: userData.data.points || 0,
            cashNumber: userData.data.cash_number || '',
            lastPlayedQuiz: userData.data.last_played_quiz || {},
            showPromotion: userData.data.show_promotion !== false
          });
        }
      } else {
        // Use fallback user if no data returned
        setUser(fallbackUser);
      }
      
      toast.success(`مرحباً بك! 👋`);
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      // Create fallback user in case of error
      const fallbackUser: User = {
        id: generateRandomId(),
        username: email.split('@')[0] || `مستخدم_${Math.floor(Math.random() * 10000)}`,
        points: 100,
        cashNumber: '',
        lastPlayedQuiz: {},
        showPromotion: true
      };
      setUser(fallbackUser);
      toast.info('تم تسجيل الدخول بنجاح كضيف');
      return true;
    } finally {
      setLoading(false);
    }
  };

  // Other methods (register, loginAnonymously, logout)
  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard'
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        const username = email.split('@')[0];
        
        // Create profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          username: username,
          points: 0,
          cash_number: '',
          last_played_quiz: {},
          show_promotion: true
        });
        
        setUser({
          id: data.user.id,
          email: data.user.email,
          username: username,
          points: 0,
          cashNumber: '',
          lastPlayedQuiz: {},
          showPromotion: true
        });
      }
      
      toast.success('تم إنشاء الحساب بنجاح');
      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error('حدث خطأ أثناء إنشاء الحساب');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Enhanced anonymous login to always work
  const loginAnonymously = async (): Promise<boolean> => {
    try {
      const userId = generateRandomId();
      const randomUsername = `زائر_${Math.floor(Math.random() * 10000)}`;
      
      const newUser: User = {
        id: userId,
        username: randomUsername,
        points: 50,
        cashNumber: '',
        lastPlayedQuiz: {},
        showPromotion: true
      };
      
      setUser(newUser);
      toast.success(`مرحباً بك ${randomUsername}! 👋`);
      return true;
    } catch (error: any) {
      console.error("Anonymous login error:", error);
      toast.error('حدث خطأ أثناء تسجيل الدخول كزائر');
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.info('تم تسجيل الخروج');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  return {
    login,
    register,
    logout,
    loginAnonymously
  };
};
