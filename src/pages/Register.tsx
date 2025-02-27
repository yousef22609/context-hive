
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { Star, User, Lock, MessageCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const success = register(username, password);
      if (success) {
        navigate('/');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <Layout>
      <div className="w-full max-w-md mx-auto animate-fade-in">
        <div className="glass-card p-8">
          <div className="flex justify-center mb-6">
            <Star className="h-12 w-12 text-primary animate-star-glow" />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-6">إنشاء حساب جديد</h1>
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">
                اسم المستخدم
              </label>
              <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-primary focus-within:border-primary overflow-hidden">
                <span className="px-3 py-2 bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 px-3 py-2 bg-transparent focus:outline-none"
                  placeholder="أدخل اسم المستخدم"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                كلمة المرور
              </label>
              <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-primary focus-within:border-primary overflow-hidden">
                <span className="px-3 py-2 bg-muted">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 px-3 py-2 bg-transparent focus:outline-none"
                  placeholder="أدخل كلمة المرور"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                تأكيد كلمة المرور
              </label>
              <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-primary focus-within:border-primary overflow-hidden">
                <span className="px-3 py-2 bg-muted">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex-1 px-3 py-2 bg-transparent focus:outline-none"
                  placeholder="أعد إدخال كلمة المرور"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* زر واتساب للدعم */}
      <a 
        href="https://wa.me/01145633198" 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-btn"
        aria-label="تواصل معنا عبر واتساب"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      
      {/* اسم المطور */}
      <div className="developer-credit">
        المطور يوسف هشام
      </div>
    </Layout>
  );
};

export default Register;
