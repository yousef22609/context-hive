
import { useState } from 'react';
import { toast } from 'sonner';
import { User } from './types';

// استخدام معرف عشوائي للمستخدم
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const useAuth = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // وظيفة لتسجيل الدخول - لن تستخدم حاليا بسبب إزالة صفحة تسجيل الدخول
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // محاكاة نجاح تسجيل الدخول
      const userId = generateRandomId();
      const username = email.split('@')[0];
      
      const newUser: User = {
        id: userId,
        email: email,
        username: username,
        points: 0,
        cashNumber: '',
        lastPlayedQuiz: {},
        showPromotion: true
      };
      
      setUser(newUser);
      toast.success(`مرحباً بك ${username}! 👋`);
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error('حدث خطأ أثناء تسجيل الدخول');
      return false;
    }
  };

  // وظيفة التسجيل - لن تستخدم حاليا بسبب إزالة صفحة التسجيل
  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      // محاكاة نجاح التسجيل
      const userId = generateRandomId();
      const username = email.split('@')[0];
      
      const newUser: User = {
        id: userId,
        email: email,
        username: username,
        points: 0,
        cashNumber: '',
        lastPlayedQuiz: {},
        showPromotion: true
      };
      
      setUser(newUser);
      toast.success('تم إنشاء الحساب بنجاح');
      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error('حدث خطأ أثناء إنشاء الحساب');
      return false;
    }
  };

  // وظيفة تسجيل الدخول كزائر
  const loginAnonymously = async (): Promise<boolean> => {
    try {
      const userId = generateRandomId();
      // توليد اسم مستخدم عشوائي بالعربية
      const randomUsername = `زائر_${Math.floor(Math.random() * 10000)}`;
      
      const newUser: User = {
        id: userId,
        username: randomUsername,
        points: 0,
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

  // وظيفة تسجيل الخروج
  const logout = async (): Promise<void> => {
    try {
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
