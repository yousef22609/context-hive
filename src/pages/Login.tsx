
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
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
        <div className="glass-card w-full max-w-md p-8 animate-fade-in">
          <div className="text-center mb-6">
            <LogIn className="h-12 w-12 text-primary mx-auto mb-2" />
            <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
            <p className="text-muted-foreground">أدخل بياناتك للوصول إلى حسابك</p>
          </div>

          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {loginError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
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
                className="w-full"
                placeholder="أدخل البريد الإلكتروني"
                required
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
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
                  className="w-full"
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
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-center">
            <Separator className="w-1/3" />
            <span className="px-2 text-xs text-muted-foreground">أو</span>
            <Separator className="w-1/3" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-4"
            onClick={handleAnonymousLogin}
            disabled={loading}
          >
            الدخول كزائر
          </Button>

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
