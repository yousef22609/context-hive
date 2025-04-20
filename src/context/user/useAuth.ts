
import { toast } from 'sonner';
import { User } from './types';
import { supabase, isSupabaseAvailable } from '../../lib/supabase';

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
      
      if (!isSupabaseAvailable()) {
        console.warn('Supabase not available for login');
        return false;
      }
      
      // Try to authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.warn('Supabase auth error:', error);
        toast.error(error.message || 'فشل تسجيل الدخول. تأكد من صحة البريد الإلكتروني وكلمة المرور.');
        return false;
      }
      
      if (data?.user) {
        const { data: userData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (userData) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            username: userData.username || data.user.email?.split('@')[0] || 'مستخدم',
            points: userData.total_points || 0,
            cashNumber: userData.cash_number || '',
            lastPlayedQuiz: userData.last_played_quiz || {},
            showPromotion: userData.show_promotion !== false
          });
          
          toast.success(`مرحباً بك ${userData.username || data.user.email?.split('@')[0] || 'مستخدم'}! 👋`);
          return true;
        }
      }
      
      toast.error('حدث خطأ في تسجيل الدخول');
      return false;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error('حدث خطأ في تسجيل الدخول');
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
      console.log('Created guest user:', newUser);
      toast.success(`مرحباً بك ${randomUsername}! 👋`);
      return true;
    } catch (error: any) {
      console.error("Anonymous login error:", error);
      toast.error('حدث خطأ أثناء تسجيل الدخول كزائر');
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!isSupabaseAvailable()) {
        console.warn('Supabase not available for register');
        return false;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard'
        }
      });
      
      if (error) {
        toast.error(error.message || 'فشل إنشاء الحساب');
        return false;
      }
      
      if (data.user) {
        const username = email.split('@')[0];
        
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: username,
            total_points: 0
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast.error('فشل إنشاء الملف الشخصي');
          return false;
        }
        
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          username: username,
          points: 0,
          cashNumber: '',
          lastPlayedQuiz: {},
          showPromotion: true
        });
        
        toast.success('تم إنشاء الحساب بنجاح');
        return true;
      }
      
      toast.error('حدث خطأ في إنشاء الحساب');
      return false;
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error('حدث خطأ أثناء إنشاء الحساب');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      if (isSupabaseAvailable()) {
        await supabase.auth.signOut();
      }
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
