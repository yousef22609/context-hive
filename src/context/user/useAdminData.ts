
import { supabase } from '../../services/supabase';
import { toast } from 'sonner';
import { User } from './types';

export const useAdminData = () => {
  const getAllUsers = async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');
        
      if (error) throw error;
      
      return data.map((profile: any) => ({
        id: profile.id,
        username: profile.username,
        points: profile.points || 0,
        cashNumber: profile.cash_number || '',
        avatar: profile.avatar,
        lastPlayedQuiz: profile.last_played_quiz || {},
        showPromotion: profile.show_promotion
      }));
    } catch (error) {
      console.error("Error getting all users:", error);
      toast.error('حدث خطأ أثناء جلب بيانات المستخدمين');
      return [];
    }
  };

  const getUsersCount = async (): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact' });
        
      if (error) throw error;
      
      return data?.length || 0;
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
