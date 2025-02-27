
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { Star, User, Lock, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const { login, addPoints } = useUser();
  const navigate = useNavigate();

  // تحقق من المكافأة اليومية
  useEffect(() => {
    const lastRewardDate = localStorage.getItem('lastDailyReward');
    const today = new Date().toDateString();
    
    if (lastRewardDate !== today) {
      setShowDailyReward(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        navigate('/');
      }
      setIsLoading(false);
    }, 500);
  };
  
  const claimDailyReward = () => {
    const today = new Date().toDateString();
    localStorage.setItem('lastDailyReward', today);
    setShowDailyReward(false);
    
    const points = Math.floor(Math.random() * 50) + 50; // مكافأة عشوائية بين 50-100 نقطة
    addPoints(points);
    toast.success(`تم إضافة ${points} نقطة كمكافأة يومية!`);
  };

  return (
    <Layout>
      <div className="w-full max-w-md mx-auto animate-fade-in">
        <div className="glass-card p-8">
          <div className="flex justify-center mb-6">
            <Star className="h-12 w-12 text-primary animate-star-glow" />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-6">تسجيل الدخول</h1>
          
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
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'جاري التسجيل...' : 'تسجيل الدخول'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
          
          {/* مكافأة يومية */}
          {showDailyReward && (
            <div className="daily-reward mt-6">
              <Star className="h-8 w-8 text-primary mx-auto mb-2 animate-star-glow" />
              <h3 className="font-bold">مكافأة يومية!</h3>
              <p className="text-sm mb-3">يمكنك الحصول على مكافأة يومية من 50-100 نقطة</p>
              <button 
                onClick={claimDailyReward}
                className="btn-primary"
              >
                احصل على المكافأة
              </button>
            </div>
          )}
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

export default Login;
