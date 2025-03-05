
import { toast } from 'sonner';
import { User } from './types';
import { supabase } from '../../services/supabase';

export const useAdminData = () => {
  const getAllUsers = async (): Promise<User[]> => {
    try {
      const response = await supabase
        .from('profiles')
        .select('*');
        
      // Handle both real Supabase and mock responses
      const data = response.data || [];
      const error = response.error;
      
      if (error) throw error;
      
      return data.map(user => ({
        id: user.id,
        username: user.username || 'مستخدم',
        points: user.points || 0,
        cashNumber: user.cash_number || '',
        avatar: user.avatar,
        lastPlayedQuiz: user.last_played_quiz || {},
        showPromotion: user.show_promotion !== false
      }));
    } catch (error) {
      console.error("Error getting all users:", error);
      toast.error('حدث خطأ أثناء جلب بيانات المستخدمين');
      return [];
    }
  };

  const getUsersCount = async (): Promise<number> => {
    try {
      const response = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      // Handle both real Supabase and mock responses
      const count = response.count !== undefined ? response.count : 0;
      const error = response.error;
      
      if (error) throw error;
      
      return count;
    } catch (error) {
      console.error("Error getting users count:", error);
      return 0;
    }
  };

  return {
    getAllUsers,
    getUsersCount
  };
};
