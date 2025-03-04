
import { useState } from 'react';
import { supabase } from '../../services/supabase';
import { toast } from 'sonner';
import { User } from './types';

export const useAuth = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return !!data.user;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message === 'Invalid login credentials' 
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
        : 'حدث خطأ أثناء تسجيل الدخول');
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            username: email.split('@')[0],
            points: 0,
            cash_number: '',
            show_promotion: true,
            last_played_quiz: {}
          });
          
        if (profileError) throw profileError;
        
        toast.success('تم إنشاء الحساب بنجاح');
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
      
      if (error.message.includes('already')) {
        errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
      }
      
      toast.error(errorMessage);
      return false;
    }
  };

  const loginAnonymously = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) throw error;
      
      if (data.user) {
        // Generate a random username with arabic prefix
        const randomUsername = `زائر_${Math.floor(Math.random() * 10000)}`;
        
        // Create anonymous user profile with better defaults
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            username: randomUsername,
            points: 0,
            cash_number: '',
            show_promotion: true,
            last_played_quiz: {}
          });
          
        if (profileError) throw profileError;
        
        // Set the user in context
        setUser({
          id: data.user.id,
          username: randomUsername,
          points: 0,
          cashNumber: '',
          lastPlayedQuiz: {},
          showPromotion: true
        });
        
        toast.success(`مرحباً بك ${randomUsername}! 👋`);
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Anonymous login error:", error);
      toast.error('حدث خطأ أثناء تسجيل الدخول كزائر');
      return false;
    }
  };

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
