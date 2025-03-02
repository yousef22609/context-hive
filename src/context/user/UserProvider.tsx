
import React, { useState, useEffect } from 'react';
import UserContext from './userContext';
import { User, UserContextType } from './types';
import { ADMIN_EMAIL } from './constants';
import { canPlayQuizCategory, getTimeRemaining, isAdmin } from './utils';
import { firebaseAuth, firebaseDB } from '../../services/firebase';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';

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
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Context value with all user functions
  const contextValue: UserContextType = {
    user,
    loading,
    
    // Authentication methods
    login: (email, password) => authService.login(email, password),
    logout: () => authService.logout(),
    register: (email, password, username) => authService.register(email, password, username),
    
    // User data methods
    addPoints: async (points) => {
      if (!user) return;
      const newPoints = await userService.addPoints(user.id, user.points, points);
      setUser({ ...user, points: newPoints });
    },
    
    exchangePoints: async (points, cashNumber) => {
      if (!user) return false;
      const [success, newPoints] = await userService.exchangePoints(user.id, user.points, points, cashNumber);
      if (success) {
        setUser({ ...user, points: newPoints, cashNumber });
      }
      return success;
    },
    
    updateCashNumber: async (cashNumber) => {
      if (!user) return;
      const success = await userService.updateCashNumber(user.id, cashNumber);
      if (success) {
        setUser({ ...user, cashNumber });
      }
    },
    
    updateAvatar: async (avatar) => {
      if (!user) return;
      const success = await userService.updateAvatar(user.id, avatar);
      if (success) {
        setUser({ ...user, avatar });
      }
    },
    
    hidePromotion: async () => {
      if (!user) return;
      const success = await userService.hidePromotion(user.id);
      if (success) {
        setUser({ ...user, showPromotion: false });
      }
    },
    
    updateLastPlayedQuiz: async (categoryId) => {
      if (!user) return;
      try {
        const timestamp = await userService.updateLastPlayedQuiz(user.id, categoryId);
        setUser({
          ...user,
          lastPlayedQuiz: {
            ...user.lastPlayedQuiz,
            [categoryId]: timestamp
          }
        });
      } catch (error) {
        console.error("Error in updateLastPlayedQuiz:", error);
      }
    },
    
    // Utility methods
    canPlayQuizCategory: (categoryId) => canPlayQuizCategory(user, categoryId),
    getTimeRemaining: (categoryId) => getTimeRemaining(user, categoryId),
    getAllUsers: () => userService.getAllUsers(),
    getUsersCount: () => userService.getUsersCount(),
    isAdmin: () => isAdmin(user, ADMIN_EMAIL)
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
