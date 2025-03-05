
import { toast } from 'sonner';
import { User } from './types';
import { supabase } from '../../services/supabase';

export const useAdminData = () => {
  const getAllUsers = async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) throw error;
      
      if (!data) return [];
      
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
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      
      return count || 0;
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
