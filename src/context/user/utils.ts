
import { User } from './types';

// Check if user can play quiz category based on cooldown time
export const canPlayQuizCategory = (user: User | null, categoryId: string): boolean => {
  if (!user || !user.lastPlayedQuiz || !user.lastPlayedQuiz[categoryId]) {
    return true;
  }

  const lastPlayed = new Date(user.lastPlayedQuiz[categoryId]);
  const now = new Date();
  const hoursDiff = (now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60);
  
  // التحقق من مرور 24 ساعة
  return hoursDiff >= 24;
};

// Calculate remaining time before user can play again
export const getTimeRemaining = (user: User | null, categoryId: string): string => {
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

// Check if user is admin
export const isAdmin = (user: User | null, adminEmail: string): boolean => {
  return user?.email === adminEmail;
};
