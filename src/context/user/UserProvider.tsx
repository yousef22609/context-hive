
import React, { useState, useEffect } from 'react';
import UserContext from './userContext';
import { User, UserContextType } from './types';
import { ADMIN_EMAIL } from './constants';
import { canPlayQuizCategory, getTimeRemaining, isAdmin } from './utils';
import { supabase } from '../../services/supabase';
import { toast } from 'sonner';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for session on initial load
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
  }, []);

  // Authentication methods
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

  // User data methods
  const addPoints = async (points: number): Promise<void> => {
    if (!user) return;
    
    try {
      const newPoints = user.points + points;
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ points: newPoints })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUser({ ...user, points: newPoints });
      
      toast.success(`تم إضافة ${points} نقطة إلى رصيدك`);
      
      // Show message to send screenshot if all answers are correct
      if (points === 15) {
        toast.success(
          'مبروك! لقد أجبت على جميع الأسئلة بشكل صحيح! التقط صورة للشاشة وأرسلها إلى 01007570190 للدخول في سحب على حساب بريميوم و 100 جنيه كاش',
          { duration: 10000 }
        );
      }
    } catch (error) {
      console.error("Error adding points:", error);
      toast.error('حدث خطأ أثناء إضافة النقاط');
    }
  };

  const exchangePoints = async (points: number, cashNumber: string): Promise<boolean> => {
    if (!user) return false;
    
    if (user.points < points) {
      toast.error('لا تملك نقاط كافية للاستبدال');
      return false;
    }
    
    if (!cashNumber.trim()) {
      toast.error('يرجى إدخال رقم الهاتف لاستلام المبلغ');
      return false;
    }
    
    try {
      const newPoints = user.points - points;
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          points: newPoints,
          cash_number: cashNumber
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUser({ ...user, points: newPoints, cashNumber });
      
      const cashAmount = (points / 1000) * 100;
      toast.success(`تم استبدال ${points} نقطة بمبلغ ${cashAmount} جنيه. سيتم إرسال المبلغ إلى الرقم ${cashNumber}`);
      
      // إرسال رسالة استبدال النقاط إلى رقم الواتساب
      try {
        const cashoutMessage = `استبدال نقاط جديد:\nالمستخدم: ${user.id}\nالنقاط: ${points}\nالمبلغ: ${cashAmount} جنيه\nرقم الاستلام: ${cashNumber}`;
        const whatsappUrl = `https://wa.me/01007570190?text=${encodeURIComponent(cashoutMessage)}`;
        
        window.open(whatsappUrl, '_blank');
      } catch (error) {
        console.error("Failed to send WhatsApp notification", error);
      }
      
      return true;
    } catch (error) {
      console.error("Error exchanging points:", error);
      toast.error('حدث خطأ أثناء استبدال النقاط');
      return false;
    }
  };

  const updateCashNumber = async (cashNumber: string): Promise<void> => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ cash_number: cashNumber })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUser({ ...user, cashNumber });
      toast.success('تم تحديث رقم الهاتف بنجاح');
    } catch (error) {
      console.error("Error updating cash number:", error);
      toast.error('حدث خطأ أثناء تحديث رقم الهاتف');
    }
  };

  const updateAvatar = async (avatar: string): Promise<void> => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ avatar })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUser({ ...user, avatar });
      toast.success('تم تحديث الصورة الشخصية بنجاح');
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error('حدث خطأ أثناء تحديث الصورة الشخصية');
    }
  };

  const hidePromotion = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ show_promotion: false })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUser({ ...user, showPromotion: false });
    } catch (error) {
      console.error("Error hiding promotion:", error);
    }
  };

  const updateLastPlayedQuiz = async (categoryId: string): Promise<void> => {
    if (!user) return;
    
    try {
      const timestamp = new Date().toISOString();
      const lastPlayedQuiz = { ...(user.lastPlayedQuiz || {}), [categoryId]: timestamp };
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ last_played_quiz: lastPlayedQuiz })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUser({
        ...user,
        lastPlayedQuiz
      });
    } catch (error) {
      console.error("Error in updateLastPlayedQuiz:", error);
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');
        
      if (error) throw error;
      
      return data.map((profile: any) => ({
        id: profile.id,
        username: profile.username,
        points: profile.points || 0,
        cashNumber: profile.cash_number || '',
        avatar: profile.avatar,
        lastPlayedQuiz: profile.last_played_quiz || {},
        showPromotion: profile.show_promotion
      }));
    } catch (error) {
      console.error("Error getting all users:", error);
      toast.error('حدث خطأ أثناء جلب بيانات المستخدمين');
      return [];
    }
  };

  const getUsersCount = async (): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('user_profiles')
        .count();
        
      if (error) throw error;
      
      return count || 0;
    } catch (error) {
      console.error("Error getting users count:", error);
      return 0;
    }
  };

  // Context value with all user functions
  const contextValue: UserContextType = {
    user,
    loading,
    setUser, // Added for the Login page
    setLoading, // Added for the Login page
    
    // Authentication methods
    login,
    logout,
    register,
    
    // User data methods
    addPoints,
    exchangePoints,
    updateCashNumber,
    updateAvatar,
    hidePromotion,
    updateLastPlayedQuiz,
    
    // Utility methods
    canPlayQuizCategory: (categoryId) => canPlayQuizCategory(user, categoryId),
    getTimeRemaining: (categoryId) => getTimeRemaining(user, categoryId),
    getAllUsers,
    getUsersCount,
    isAdmin: () => isAdmin(user, ADMIN_EMAIL)
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
