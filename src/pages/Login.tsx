
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { Eye, EyeOff, LogIn, AlertCircle, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { user, login, loginAnonymously, loading } = useUser();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLoginError('يرجى إدخال بريد إلكتروني صالح');
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setLoginError('فشل تسجيل الدخول. تأكد من صحة البريد الإلكتروني وكلمة المرور.');
    }
  };

  const handleAnonymousLogin = async () => {
    setLoginError('');
    const success = await loginAnonymously();
    if (success) {
      navigate('/dashboard');
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
        <div className="backdrop-blur-sm bg-black/40 border border-purple-900/50 w-full max-w-md p-8 rounded-xl shadow-xl animate-fade-in">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Flame className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">مرحبًا بك في Zexs</h1>
            <p className="text-gray-400">سجل دخولك للبدء في نار التحدي</p>
          </div>

          {loginError && (
            <Alert variant="destructive" className="mb-4 bg-red-950/50 border-red-900">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {loginError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLoginError('');
                }}
                className="w-full bg-black/50 border-gray-700 text-white placeholder-gray-500"
                placeholder="أدخل البريد الإلكتروني"
                required
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                كلمة المرور
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full bg-black/50 border-gray-700 text-white placeholder-gray-500"
                  placeholder="أدخل كلمة المرور"
                  required
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white" 
              disabled={loading}
            >
              {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-center">
            <Separator className="w-1/3 bg-gray-700" />
            <span className="px-2 text-xs text-gray-400">أو</span>
            <Separator className="w-1/3 bg-gray-700" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-4 border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={handleAnonymousLogin}
            disabled={loading}
          >
            الدخول كزائر
          </Button>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-orange-500 hover:underline">
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
