
import { toast } from 'sonner';
import { firebaseAuth } from './firebase';

export const authService = {
  login: async (username: string, password: string): Promise<boolean> => {
    try {
      await firebaseAuth.login(username, password);
      toast.success('تم تسجيل الدخول بنجاح');
      return true;
    } catch (error: any) {
      const errorMessage = error.code === 'auth/invalid-credential' 
        ? 'اسم المستخدم أو كلمة المرور غير صحيحة'
        : 'حدث خطأ أثناء تسجيل الدخول';
      toast.error(errorMessage);
      return false;
    }
  },

  register: async (username: string, password: string): Promise<boolean> => {
    try {
      await firebaseAuth.register(username, password);
      toast.success('تم إنشاء الحساب وتسجيل الدخول بنجاح');
      return true;
    } catch (error: any) {
      let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'اسم المستخدم مستخدم بالفعل';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'كلمة المرور ضعيفة جدًا';
      }
      toast.error(errorMessage);
      return false;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await firebaseAuth.logout();
      toast.info('تم تسجيل الخروج');
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  }
};
