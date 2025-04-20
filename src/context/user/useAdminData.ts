
import { toast } from 'sonner';
import { User } from './types';
import { supabase, isSupabaseAvailable } from '../../lib/supabase';

export const useAdminData = () => {
  const getAllUsers = async (): Promise<User[]> => {
    try {
      if (!isSupabaseAvailable()) {
        console.warn('Supabase not available for getAllUsers');
        return [];
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) throw error;
      
      return (data || []).map(user => ({
        id: user.id,
        username: user.username || 'مستخدم',
        points: user.total_points || 0,
        cashNumber: user.cash_number || '',
        avatar: user.avatar_url,
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
      if (!isSupabaseAvailable()) {
        console.warn('Supabase not available for getUsersCount');
        return 0;
      }
      
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
