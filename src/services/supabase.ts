
// مكتبة Supabase غير مستخدمة حاليًا، لكننا نستبقي الواجهة لتجنب أخطاء في التطبيق

export interface UserProfile {
  id: string;
  username: string;
  points: number;
  cash_number: string;
  avatar?: string;
  last_played_quiz?: Record<string, string>;
  show_promotion?: boolean;
}

// واجهات للتوافق مع الكود الحالي
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  console.log('getUserProfile is mocked', userId);
  return null;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  console.log('updateUserProfile is mocked', userId, updates);
  return true;
};

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: async () => {}
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
    update: () => ({
      eq: async () => ({ error: null }),
    }),
    insert: () => ({
      eq: async () => ({ error: null }),
    }),
  }),
};
