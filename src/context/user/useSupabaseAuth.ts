
import { useEffect } from 'react';
import { User } from './types';

export const useSupabaseAuth = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    // بدء اللعب فورًا بدون الحاجة للاتصال بالخادم
    setLoading(false);
  }, [setUser, setLoading]);
};
