import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { QuizCategory } from '../data/quizData';

export interface User {
  id: string;
  username: string;
  points: number;
  cashNumber: string;
  avatar?: string;
  lastPlayedQuiz?: Record<string, string>; // القائمة وتاريخ آخر لعب
  showPromotion?: boolean;
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, password: string) => boolean;
  addPoints: (points: number) => void;
  exchangePoints: (points: number, cashNumber: string) => boolean;
  updateCashNumber: (cashNumber: string) => void;
  updateAvatar: (avatar: string) => void;
  canPlayQuizCategory: (categoryId: string) => boolean;
  updateLastPlayedQuiz: (categoryId: string) => void;
  getTimeRemaining: (categoryId: string) => string;
  hidePromotion: () => void;
  getAllUsers: () => User[];
  getUsersCount: () => number;
  isAdmin: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock users data - in a real app, this would come from a database
const mockUsers: Record<string, { username: string; password: string; points: number; cashNumber: string; avatar?: string; lastPlayedQuiz?: Record<string, string>; showPromotion?: boolean }> = {
  'user1': { username: 'يوسف هشام', password: '123456', points: 100, cashNumber: '01007570190', avatar: 'https://i.pravatar.cc/150?img=11', showPromotion: true },
  'user2': { username: 'احمد', password: '123456', points: 25, cashNumber: '01234567890', avatar: 'https://i.pravatar.cc/150?img=1', showPromotion: true },
  'user3': { username: 'محمد', password: '123456', points: 18, cashNumber: '01098765432', avatar: 'https://i.pravatar.cc/150?img=2', showPromotion: true },
  'user4': { username: 'سارة', password: '123456', points: 32, cashNumber: '01112223344', avatar: 'https://i.pravatar.cc/150?img=3', showPromotion: true },
  'user5': { username: 'فاطمة', password: '123456', points: 47, cashNumber: '01098765432', avatar: 'https://i.pravatar.cc/150?img=4', showPromotion: true },
  'user6': { username: 'عمر', password: '123456', points: 55, cashNumber: '01112223344', avatar: 'https://i.pravatar.cc/150?img=5', showPromotion: true },
  'user7': { username: 'خالد', password: '123456', points: 29, cashNumber: '01098765432', avatar: 'https://i.pravatar.cc/150?img=6', showPromotion: true },
  'user8': { username: 'ليلى', password: '123456', points: 37, cashNumber: '01112223344', avatar: 'https://i.pravatar.cc/150?img=7', showPromotion: true },
  'user9': { username: 'حسن', password: '123456', points: 62, cashNumber: '01098765432', avatar: 'https://i.pravatar.cc/150?img=8', showPromotion: true },
  'user10': { username: 'نور', password: '123456', points: 41, cashNumber: '01112223344', avatar: 'https://i.pravatar.cc/150?img=9', showPromotion: true },
};

// تحديد المستخدم الذي لديه صلاحيات المسؤول
const ADMIN_USER_ID = 'user1'; // يوسف هشام هو المسؤول

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('yoma-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('yoma-user');
      }
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('yoma-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('yoma-user');
    }
  }, [user]);

  // تحقق إذا كان يمكن للمستخدم لعب فئة معينة بناءً على وقت الانتظار
  const canPlayQuizCategory = (categoryId: string) => {
    if (!user || !user.lastPlayedQuiz || !user.lastPlayedQuiz[categoryId]) {
      return true;
    }

    const lastPlayed = new Date(user.lastPlayedQuiz[categoryId]);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60);
    
    // التحقق من مرور 24 ساعة
    return hoursDiff >= 24;
  };

  // تحديث وقت آخر لعب للفئة
  const updateLastPlayedQuiz = (categoryId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        lastPlayedQuiz: {
          ...user.lastPlayedQuiz,
          [categoryId]: new Date().toISOString()
        }
      };
      
      setUser(updatedUser);
      
      // تحديث في mockUsers أيضًا
      if (mockUsers[user.id]) {
        mockUsers[user.id].lastPlayedQuiz = {
          ...mockUsers[user.id].lastPlayedQuiz,
          [categoryId]: new Date().toISOString()
        };
      }
    }
  };

  // حساب الوقت المتبقي لإعادة اللعب
  const getTimeRemaining = (categoryId: string) => {
    if (!user || !user.lastPlayedQuiz || !user.lastPlayedQuiz[categoryId]) {
      return "متاح الآن";
    }

    const lastPlayed = new Date(user.lastPlayedQuiz[categoryId]);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff >= 24) {
      return "متاح الآن";
    }
    
    const hoursRemaining = Math.ceil(24 - hoursDiff);
    return `متاح بعد ${hoursRemaining} ساعة`;
  };

  const login = (username: string, password: string) => {
    // Find user by username
    const userId = Object.keys(mockUsers).find(id => mockUsers[id].username === username);
    
    if (userId && mockUsers[userId].password === password) {
      setUser({
        id: userId,
        username: mockUsers[userId].username,
        points: mockUsers[userId].points,
        cashNumber: mockUsers[userId].cashNumber,
        avatar: mockUsers[userId].avatar,
        lastPlayedQuiz: mockUsers[userId].lastPlayedQuiz || {},
        showPromotion: mockUsers[userId].showPromotion
      });
      toast.success('تم تسجيل الدخول بنجاح');
      return true;
    } else {
      toast.error('اسم المستخدم أو كلمة المرور غير صحيحة');
      return false;
    }
  };

  const register = (username: string, password: string) => {
    // Check if username already exists
    const usernameExists = Object.values(mockUsers).some(user => user.username === username);
    
    if (usernameExists) {
      toast.error('اسم المستخدم موجود بالفعل');
      return false;
    }

    // Create new user ID that's unique
    const newUserId = `user${Object.keys(mockUsers).length + 1}`;
    
    // Add new user to mockUsers
    mockUsers[newUserId] = {
      username,
      password,
      points: 0,
      cashNumber: '',
      showPromotion: true
    };
    
    // Log in with new user
    setUser({
      id: newUserId,
      username,
      points: 0,
      cashNumber: '',
      lastPlayedQuiz: {},
      showPromotion: true
    });
    
    toast.success('تم إنشاء الحساب وتسجيل الدخول بنجاح');
    return true;
  };

  const logout = () => {
    setUser(null);
    toast.info('تم تسجيل الخروج');
  };

  const addPoints = (points: number) => {
    if (user) {
      const newPoints = user.points + points;
      setUser({ ...user, points: newPoints });
      
      // Update mock data
      if (mockUsers[user.id]) {
        mockUsers[user.id].points = newPoints;
      }
      
      toast.success(`تم إضافة ${points} نقطة إلى رصيدك`);
      
      // Show message to send screenshot if all answers are correct
      if (points === 15) {
        toast.success(
          'مبروك! لقد أجبت على جميع الأسئلة بشكل صحيح! التقط صورة للشاشة وأرسلها إلى 01007570190 للدخول في سحب على حساب بريميوم و 100 جنيه كاش',
          { duration: 10000 }
        );
      }
    }
  };

  const exchangePoints = (points: number, cashNumber: string) => {
    if (!user) return false;
    
    if (user.points < points) {
      toast.error('لا تملك نقاط كافية للاستبدال');
      return false;
    }
    
    if (!cashNumber.trim()) {
      toast.error('يرجى إدخال رقم الهاتف لاستلام المبلغ');
      return false;
    }
    
    const newPoints = user.points - points;
    setUser({ ...user, points: newPoints, cashNumber });
    
    // Update mock data
    if (mockUsers[user.id]) {
      mockUsers[user.id].points = newPoints;
      mockUsers[user.id].cashNumber = cashNumber;
    }
    
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
  };

  const updateCashNumber = (cashNumber: string) => {
    if (user) {
      setUser({ ...user, cashNumber });
      
      // Update mock data
      if (mockUsers[user.id]) {
        mockUsers[user.id].cashNumber = cashNumber;
      }
      
      toast.success('تم تحديث رقم الهاتف بنجاح');
    }
  };

  const updateAvatar = (avatar: string) => {
    if (user) {
      setUser({ ...user, avatar });
      
      // Update mock data
      if (mockUsers[user.id]) {
        mockUsers[user.id].avatar = avatar;
      }
      
      toast.success('تم تحديث الصورة الشخصية بنجاح');
    }
  };
  
  const hidePromotion = () => {
    if (user) {
      setUser({ ...user, showPromotion: false });
      
      // Update mock data
      if (mockUsers[user.id]) {
        mockUsers[user.id].showPromotion = false;
      }
    }
  };

  // وظائف إدارة المستخدمين للمسؤول
  const getAllUsers = () => {
    // تحويل مجموعة المستخدمين من كائن إلى مصفوفة
    return Object.keys(mockUsers).map(id => ({
      id,
      username: mockUsers[id].username,
      points: mockUsers[id].points,
      cashNumber: mockUsers[id].cashNumber,
      avatar: mockUsers[id].avatar,
      lastPlayedQuiz: mockUsers[id].lastPlayedQuiz || {},
      showPromotion: mockUsers[id].showPromotion
    }));
  };

  // الحصول على عدد المستخدمين
  const getUsersCount = () => {
    return Object.keys(mockUsers).length;
  };

  // التحقق مما إذا كان المستخدم الحالي هو المسؤول
  const isAdmin = () => {
    return user?.id === ADMIN_USER_ID;
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      addPoints, 
      exchangePoints,
      updateCashNumber,
      updateAvatar,
      canPlayQuizCategory,
      updateLastPlayedQuiz,
      getTimeRemaining,
      hidePromotion,
      getAllUsers,
      getUsersCount,
      isAdmin
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
