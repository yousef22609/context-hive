import React, { useState, useEffect } from 'react';
import UserContext from './userContext';
import { User, UserContextType } from './types';
import { ADMIN_EMAIL } from './constants';
import { canPlayQuizCategory, getTimeRemaining, isAdmin } from './utils';
import { useAuth } from './useAuth';
import { useUserData } from './useUserData';
import { useAdminData } from './useAdminData';
// Remove the import for useSupabaseAuth since we won't use it until Supabase is properly configured

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Remove the useSupabaseAuth call that was causing the error
  // We'll rely on anonymous login instead for now

  // Get authentication methods
  const { login, register, logout, loginAnonymously } = useAuth(setUser, setLoading);

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

  // Auto-login anonymously if no user is detected
  useEffect(() => {
    const handleAnonymousLogin = async () => {
      if (!loading && !user) {
        await loginAnonymously();
        setLoading(false);
      } else {
        // If we already have a user or are still loading, just update loading state
        setLoading(false);
      }
    };
    
    handleAnonymousLogin();
  }, [loading, user, loginAnonymously]);

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
    loginAnonymously,
    
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
