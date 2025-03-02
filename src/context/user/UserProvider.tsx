
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import UserContext from './userContext';
import { User, UserContextType } from './types';
import { ADMIN_EMAIL } from './constants';
import { canPlayQuizCategory as checkCanPlayQuizCategory, getTimeRemaining as calculateTimeRemaining, isAdmin as checkIsAdmin } from './utils';
import { firebaseAuth, firebaseDB } from '../../services/firebase';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // Get user profile from database
          const userProfile = await firebaseDB.getUserProfile(firebaseUser.uid);
          if (userProfile) {
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || undefined,
              username: userProfile.username,
              points: userProfile.points,
              cashNumber: userProfile.cashNumber,
              avatar: userProfile.avatar,
              lastPlayedQuiz: userProfile.lastPlayedQuiz || {},
              showPromotion: userProfile.showPromotion
            });
          } else {
            console.error("User profile not found in database");
            await firebaseAuth.logout();
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast.error("حدث خطأ أثناء تحميل بيانات المستخدم");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await firebaseAuth.login(email, password);
      toast.success('تم تسجيل الدخول بنجاح');
      return true;
    } catch (error: any) {
      const errorMessage = error.code === 'auth/invalid-credential' 
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        : 'حدث خطأ أثناء تسجيل الدخول';
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      await firebaseAuth.register(email, password, username);
      toast.success('تم إنشاء الحساب وتسجيل الدخول بنجاح');
      return true;
    } catch (error: any) {
      let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'كلمة المرور ضعيفة جدًا';
      }
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = async () => {
    try {
      await firebaseAuth.logout();
      toast.info('تم تسجيل الخروج');
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  const addPoints = async (points: number) => {
    if (!user) return;
    
    try {
      await firebaseDB.updatePoints(user.id, points);
      setUser({
        ...user,
        points: user.points + points
      });
      
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

  const exchangePoints = async (points: number, cashNumber: string) => {
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
      await firebaseDB.updateUserProfile(user.id, {
        points: user.points - points,
        cashNumber
      });
      
      setUser({
        ...user,
        points: user.points - points,
        cashNumber
      });
      
      const cashAmount = (points / 1000) * 100;
      toast.success(`تم استبدال ${points} نقطة بمبلغ ${cashAmount} جنيه. سيتم إرسال المبلغ إلى الرقم ${cashNumber}`);
      
      // إرسال رسالة استبدال النقاط إلى رقم الواتساب
      try {
        const cashoutMessage = `استبدال نقاط جديد:\nالمستخدم: ${user.username}\nالنقاط: ${points}\nالمبلغ: ${cashAmount} جنيه\nرقم الاستلام: ${cashNumber}`;
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

  const updateCashNumber = async (cashNumber: string) => {
    if (!user) return;
    
    try {
      await firebaseDB.updateUserProfile(user.id, { cashNumber });
      setUser({ ...user, cashNumber });
      toast.success('تم تحديث رقم الهاتف بنجاح');
    } catch (error) {
      console.error("Error updating cash number:", error);
      toast.error('حدث خطأ أثناء تحديث رقم الهاتف');
    }
  };

  const updateAvatar = async (avatar: string) => {
    if (!user) return;
    
    try {
      await firebaseDB.updateUserProfile(user.id, { avatar });
      setUser({ ...user, avatar });
      toast.success('تم تحديث الصورة الشخصية بنجاح');
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error('حدث خطأ أثناء تحديث الصورة الشخصية');
    }
  };
  
  const hidePromotion = async () => {
    if (!user) return;
    
    try {
      await firebaseDB.updateUserProfile(user.id, { showPromotion: false });
      setUser({ ...user, showPromotion: false });
    } catch (error) {
      console.error("Error hiding promotion:", error);
    }
  };

  const updateLastPlayedQuiz = async (categoryId: string) => {
    if (!user) return;
    
    try {
      await firebaseDB.updateLastPlayedQuiz(user.id, categoryId);
      
      setUser({
        ...user,
        lastPlayedQuiz: {
          ...user.lastPlayedQuiz,
          [categoryId]: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Error updating last played quiz:", error);
    }
  };

  // User management functions for admin
  const getAllUsers = async () => {
    try {
      return await firebaseDB.getAllUsers();
    } catch (error) {
      console.error("Error getting all users:", error);
      toast.error('حدث خطأ أثناء جلب بيانات المستخدمين');
      return [];
    }
  };

  // Get users count
  const getUsersCount = async () => {
    try {
      const users = await firebaseDB.getAllUsers();
      return users.length;
    } catch (error) {
      console.error("Error getting users count:", error);
      return 0;
    }
  };

  // Context value with all user functions
  const contextValue: UserContextType = {
    user,
    loading,
    login,
    logout,
    register,
    addPoints,
    exchangePoints,
    updateCashNumber,
    updateAvatar,
    canPlayQuizCategory: (categoryId) => checkCanPlayQuizCategory(user, categoryId),
    updateLastPlayedQuiz,
    getTimeRemaining: (categoryId) => calculateTimeRemaining(user, categoryId),
    hidePromotion,
    getAllUsers,
    getUsersCount,
    isAdmin: () => checkIsAdmin(user, ADMIN_EMAIL)
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
