
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface User {
  id: string;
  username: string;
  points: number;
  cashNumber: string;
  avatar?: string; // إضافة حقل الصورة الشخصية
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, password: string) => boolean;
  addPoints: (points: number) => void;
  exchangePoints: (points: number, cashNumber: string) => boolean;
  updateCashNumber: (cashNumber: string) => void;
  updateAvatar: (avatar: string) => void; // إضافة دالة تحديث الصورة الشخصية
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock users data - in a real app, this would come from a database
const mockUsers: Record<string, { username: string; password: string; points: number; cashNumber: string; avatar?: string }> = {
  'user1': { username: 'احمد', password: '123456', points: 2500, cashNumber: '01234567890', avatar: 'https://i.pravatar.cc/150?img=1' },
  'user2': { username: 'محمد', password: '123456', points: 1800, cashNumber: '01098765432', avatar: 'https://i.pravatar.cc/150?img=2' },
  'user3': { username: 'سارة', password: '123456', points: 3200, cashNumber: '01112223344', avatar: 'https://i.pravatar.cc/150?img=3' },
};

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

  const login = (username: string, password: string) => {
    // Find user by username
    const userId = Object.keys(mockUsers).find(id => mockUsers[id].username === username);
    
    if (userId && mockUsers[userId].password === password) {
      setUser({
        id: userId,
        username: mockUsers[userId].username,
        points: mockUsers[userId].points,
        cashNumber: mockUsers[userId].cashNumber,
        avatar: mockUsers[userId].avatar
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

    // Create new user ID
    const newUserId = `user${Object.keys(mockUsers).length + 1}`;
    
    // Add new user to mockUsers
    mockUsers[newUserId] = {
      username,
      password,
      points: 0,
      cashNumber: ''
    };
    
    // Log in with new user
    setUser({
      id: newUserId,
      username,
      points: 0,
      cashNumber: ''
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

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      addPoints, 
      exchangePoints,
      updateCashNumber,
      updateAvatar
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
