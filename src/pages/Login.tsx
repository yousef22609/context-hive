
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../services/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { user, setUser, loading, setLoading } = useUser();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('يرجى إدخال بريد إلكتروني صالح');
      return;
    }
    
    try {
      setLoading(true);
      console.log("Attempting login with:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        toast.success('تم تسجيل الدخول بنجاح! جاري تحويلك إلى لوحة التحكم...');
        
        // Get user profile from Supabase or create one if it doesn't exist
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileData) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            username: profileData.username || data.user.email?.split('@')[0] || '',
            points: profileData.points || 0,
            cashNumber: profileData.cash_number || '',
            avatar: profileData.avatar,
            lastPlayedQuiz: profileData.last_played_quiz || {},
            showPromotion: profileData.show_promotion
          });
        } else {
          // Create new profile
          const newProfile = {
            id: data.user.id,
            username: data.user.email?.split('@')[0] || '',
            points: 0,
            cash_number: '',
            show_promotion: true,
            last_played_quiz: {}
          };
          
          await supabase.from('user_profiles').insert(newProfile);
          
          setUser({
            id: data.user.id,
            email: data.user.email,
            username: newProfile.username,
            points: newProfile.points,
            cashNumber: newProfile.cash_number,
            lastPlayedQuiz: newProfile.last_played_quiz,
            showPromotion: newProfile.show_promotion
          });
        }
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.message === 'Invalid login credentials'
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        : 'حدث خطأ أثناء تسجيل الدخول';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // If user is already logged in, don't render the login page
  if (user) return null;

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="glass-card w-full max-w-md p-8 animate-fade-in">
          <div className="text-center mb-6">
            <LogIn className="h-12 w-12 text-primary mx-auto mb-2" />
            <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
            <p className="text-muted-foreground">أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-background border rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                placeholder="أدخل البريد الإلكتروني"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 bg-background border rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              disabled={loading}
            >
              {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p>
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-primary hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
