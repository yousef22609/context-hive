
import { toast } from 'sonner';
import { firebaseDB } from './firebase';
import { User } from '../context/user/types';

export const userService = {
  addPoints: async (userId: string, currentPoints: number, points: number): Promise<number> => {
    try {
      await firebaseDB.updatePoints(userId, points);
      const newPoints = currentPoints + points;
      
      toast.success(`تم إضافة ${points} نقطة إلى رصيدك`);
      
      // Show message to send screenshot if all answers are correct
      if (points === 15) {
        toast.success(
          'مبروك! لقد أجبت على جميع الأسئلة بشكل صحيح! التقط صورة للشاشة وأرسلها إلى 01007570190 للدخول في سحب على حساب بريميوم و 100 جنيه كاش',
          { duration: 10000 }
        );
      }
      
      return newPoints;
    } catch (error) {
      console.error("Error adding points:", error);
      toast.error('حدث خطأ أثناء إضافة النقاط');
      return currentPoints;
    }
  },

  exchangePoints: async (userId: string, currentPoints: number, points: number, cashNumber: string): Promise<[boolean, number]> => {
    if (currentPoints < points) {
      toast.error('لا تملك نقاط كافية للاستبدال');
      return [false, currentPoints];
    }
    
    if (!cashNumber.trim()) {
      toast.error('يرجى إدخال رقم الهاتف لاستلام المبلغ');
      return [false, currentPoints];
    }
    
    try {
      await firebaseDB.updateUserProfile(userId, {
        points: currentPoints - points,
        cashNumber
      });
      
      const newPoints = currentPoints - points;
      const cashAmount = (points / 1000) * 100;
      toast.success(`تم استبدال ${points} نقطة بمبلغ ${cashAmount} جنيه. سيتم إرسال المبلغ إلى الرقم ${cashNumber}`);
      
      // إرسال رسالة استبدال النقاط إلى رقم الواتساب
      try {
        const cashoutMessage = `استبدال نقاط جديد:\nالمستخدم: ${userId}\nالنقاط: ${points}\nالمبلغ: ${cashAmount} جنيه\nرقم الاستلام: ${cashNumber}`;
        const whatsappUrl = `https://wa.me/01007570190?text=${encodeURIComponent(cashoutMessage)}`;
        
        window.open(whatsappUrl, '_blank');
      } catch (error) {
        console.error("Failed to send WhatsApp notification", error);
      }
      
      return [true, newPoints];
    } catch (error) {
      console.error("Error exchanging points:", error);
      toast.error('حدث خطأ أثناء استبدال النقاط');
      return [false, currentPoints];
    }
  },

  updateCashNumber: async (userId: string, cashNumber: string): Promise<boolean> => {
    try {
      await firebaseDB.updateUserProfile(userId, { cashNumber });
      toast.success('تم تحديث رقم الهاتف بنجاح');
      return true;
    } catch (error) {
      console.error("Error updating cash number:", error);
      toast.error('حدث خطأ أثناء تحديث رقم الهاتف');
      return false;
    }
  },

  updateAvatar: async (userId: string, avatar: string): Promise<boolean> => {
    try {
      await firebaseDB.updateUserProfile(userId, { avatar });
      toast.success('تم تحديث الصورة الشخصية بنجاح');
      return true;
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error('حدث خطأ أثناء تحديث الصورة الشخصية');
      return false;
    }
  },
  
  hidePromotion: async (userId: string): Promise<boolean> => {
    try {
      await firebaseDB.updateUserProfile(userId, { showPromotion: false });
      return true;
    } catch (error) {
      console.error("Error hiding promotion:", error);
      return false;
    }
  },

  updateLastPlayedQuiz: async (userId: string, categoryId: string): Promise<string> => {
    try {
      await firebaseDB.updateLastPlayedQuiz(userId, categoryId);
      return new Date().toISOString();
    } catch (error) {
      console.error("Error updating last played quiz:", error);
      throw error;
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      return await firebaseDB.getAllUsers();
    } catch (error) {
      console.error("Error getting all users:", error);
      toast.error('حدث خطأ أثناء جلب بيانات المستخدمين');
      return [];
    }
  },

  getUsersCount: async (): Promise<number> => {
    try {
      const users = await firebaseDB.getAllUsers();
      return users.length;
    } catch (error) {
      console.error("Error getting users count:", error);
      return 0;
    }
  }
};
