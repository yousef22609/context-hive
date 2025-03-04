
import React, { useState } from 'react';
import UserContext from './userContext';
import { User, UserContextType } from './types';
import { ADMIN_EMAIL } from './constants';
import { canPlayQuizCategory, getTimeRemaining, isAdmin } from './utils';
import { useAuth } from './useAuth';
import { useUserData } from './useUserData';
import { useAdminData } from './useAdminData';
import { useSupabaseAuth } from './useSupabaseAuth';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Use the authentication hook to manage Supabase session
  useSupabaseAuth(setUser, setLoading);

  // Get authentication methods
  const { login, register, logout } = useAuth(setUser, setLoading);

  // Get user data methods
  const {
    addPoints,
    exchangePoints,
    updateCashNumber,
    updateAvatar,
    hidePromotion,
    updateLastPlayedQuiz
  } = useUserData(user, setUser);

  // Get admin data methods
  const { getAllUsers, getUsersCount } = useAdminData();

  // Context value with all user functions
  const contextValue: UserContextType = {
    user,
    loading,
    setUser,
    setLoading,
    
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
