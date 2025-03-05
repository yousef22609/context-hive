
import { toast } from 'sonner';
import { User } from './types';

export const useAdminData = () => {
  const getAllUsers = async (): Promise<User[]> => {
    try {
      // محاكاة بيانات للمستخدمين
      return [
        {
          id: '1',
          username: 'مستخدم_1',
          points: 1500,
          cashNumber: '01012345678',
          showPromotion: false
        },
        {
          id: '2',
          username: 'مستخدم_2',
          points: 2000,
          cashNumber: '01023456789',
          showPromotion: true
        },
        {
          id: '3',
          username: 'مستخدم_3',
          points: 3000,
          cashNumber: '01034567890',
          showPromotion: false
        }
      ];
    } catch (error) {
      console.error("Error getting all users:", error);
      toast.error('حدث خطأ أثناء جلب بيانات المستخدمين');
      return [];
    }
  };

  const getUsersCount = async (): Promise<number> => {
    try {
      // محاكاة عدد المستخدمين
      return 3;
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
