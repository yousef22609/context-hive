
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { user, loading, loginAnonymously } = useUser();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    } else if (!loading) {
      // If user is not logged in and not loading, login anonymously
      loginAnonymously();
    }
  }, [user, loading, navigate, loginAnonymously]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to dashboard - we're using anonymous login instead
    navigate('/dashboard');
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
            <p className="text-muted-foreground">تم تفعيل تسجيل الدخول كزائر تلقائياً</p>
          </div>

          <div className="text-center mt-6">
            <p>جاري تحويلك إلى لوحة التحكم...</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
