
import { toast } from 'sonner';
import { User } from './types';

export const useUserData = (
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const addPoints = async (points: number): Promise<void> => {
    if (!user) return;
    
    try {
      const newPoints = user.points + points;
      
      setUser({ ...user, points: newPoints });
      
      toast.success(`تم إضافة ${points} نقطة إلى رصيدك`);
      
      // عرض رسالة إذا كانت جميع الإجابات صحيحة
      if (points === 15) {
        toast.success(
          'مبروك! لقد أجبت على جميع الأسئلة بشكل صحيح! التقط صورة للشاشة وأرسلها إلى 01007570190 للدخول في سحب على حساب بريميوم و 100 جنيه كاش',
          { duration: 10000 }
        );
      }
    } catch (error) {
      console.error("Error adding points:", error);
      toast.error('حدث خطأ أثناء إضافة النقاط');
    }
  };

  const exchangePoints = async (points: number, cashNumber: string): Promise<boolean> => {
    if (!user) return false;
    
    if (user.points < points) {
      toast.error('لا تملك نقاط كافية للاستبدال');
      return false;
    }
    
    if (!cashNumber.trim()) {
      toast.error('يرجى إدخال رقم الهاتف لاستلام المبلغ');
      return false;
    }
    
    try {
      const newPoints = user.points - points;
      
      setUser({ ...user, points: newPoints, cashNumber });
      
      const cashAmount = (points / 1000) * 100;
      toast.success(`تم استبدال ${points} نقطة بمبلغ ${cashAmount} جنيه. سيتم إرسال المبلغ إلى الرقم ${cashNumber}`);
      
      // إرسال رسالة استبدال النقاط إلى رقم الواتساب
      try {
        const cashoutMessage = `استبدال نقاط جديد:\nالمستخدم: ${user.id}\nالنقاط: ${points}\nالمبلغ: ${cashAmount} جنيه\nرقم الاستلام: ${cashNumber}`;
        const whatsappUrl = `https://wa.me/01007570190?text=${encodeURIComponent(cashoutMessage)}`;
        
        window.open(whatsappUrl, '_blank');
      } catch (error) {
        console.error("Failed to send WhatsApp notification", error);
      }
      
      return true;
    } catch (error) {
      console.error("Error exchanging points:", error);
      toast.error('حدث خطأ أثناء استبدال النقاط');
      return false;
    }
  };

  const updateCashNumber = async (cashNumber: string): Promise<void> => {
    if (!user) return;
    
    try {
      setUser({ ...user, cashNumber });
      toast.success('تم تحديث رقم الهاتف بنجاح');
    } catch (error) {
      console.error("Error updating cash number:", error);
      toast.error('حدث خطأ أثناء تحديث رقم الهاتف');
    }
  };

  const updateAvatar = async (avatar: string): Promise<void> => {
    if (!user) return;
    
    try {
      setUser({ ...user, avatar });
      toast.success('تم تحديث الصورة الشخصية بنجاح');
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error('حدث خطأ أثناء تحديث الصورة الشخصية');
    }
  };

  const hidePromotion = async (): Promise<void> => {
    if (!user) return;
    
    try {
      setUser({ ...user, showPromotion: false });
    } catch (error) {
      console.error("Error hiding promotion:", error);
    }
  };

  const updateLastPlayedQuiz = async (categoryId: string): Promise<void> => {
    if (!user) return;
    
    try {
      const timestamp = new Date().toISOString();
      const lastPlayedQuiz = { ...(user.lastPlayedQuiz || {}), [categoryId]: timestamp };
      
      setUser({
        ...user,
        lastPlayedQuiz
      });
    } catch (error) {
      console.error("Error in updateLastPlayedQuiz:", error);
    }
  };

  return {
    addPoints,
    exchangePoints,
    updateCashNumber,
    updateAvatar,
    hidePromotion,
    updateLastPlayedQuiz
  };
};
