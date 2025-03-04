
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  username: string;
  points: number;
  cashNumber: string;
  avatar?: string;
  lastPlayedQuiz?: Record<string, string>;
  showPromotion?: boolean;
  email?: string;
}

export interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<boolean>;
  loginAnonymously: () => Promise<boolean>;
  addPoints: (points: number) => Promise<void>;
  exchangePoints: (points: number, cashNumber: string) => Promise<boolean>;
  updateCashNumber: (cashNumber: string) => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
  canPlayQuizCategory: (categoryId: string) => boolean;
  updateLastPlayedQuiz: (categoryId: string) => Promise<void>;
  getTimeRemaining: (categoryId: string) => string;
  hidePromotion: () => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  getUsersCount: () => Promise<number>;
  isAdmin: () => boolean;
}
