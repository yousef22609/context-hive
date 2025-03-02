
import { toast } from 'sonner';
import { firebaseAuth } from './firebase';

export const authService = {
  login: async (email: string, password: string): Promise<boolean> => {
    try {
      await firebaseAuth.login(email, password);
      toast.success('تم تسجيل الدخول بنجاح');
      return true;
    } catch (error: any) {
      const errorMessage = error.code === 'auth/invalid-credential' 
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        : 'حدث خطأ أثناء تسجيل الدخول';
      toast.error(errorMessage);
      return false;
    }
  },

  register: async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      await firebaseAuth.register(email, password, username);
      toast.success('تم إنشاء الحساب وتسجيل الدخول بنجاح');
      return true;
    } catch (error: any) {
      let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
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
