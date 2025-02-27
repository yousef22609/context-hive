
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, User, Award, DollarSign, MessageCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import AnimatedBackground from './AnimatedBackground';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useUser();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/50 ar-text overflow-hidden relative">
      <AnimatedBackground />
      
      <header className="w-full py-4 px-6 glass-card z-10 mb-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Star className="h-8 w-8 text-primary animate-star-glow" />
          <span className="text-2xl font-bold">يوما</span>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm md:text-base hidden md:inline-block">
              مرحباً، <span className="font-bold">{user.username}</span>
            </span>
            <span className="text-sm font-medium bg-primary/20 px-3 py-1 rounded-full">
              {user.points} نقطة
            </span>
            <button 
              onClick={logout}
              className="btn-outline text-sm"
            >
              تسجيل الخروج
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary">
            تسجيل الدخول
          </Link>
        )}
      </header>

      {user && (
        <nav className="w-full max-w-4xl mx-auto mb-6 px-4">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <NavItem 
              to="/play" 
              icon={<Star className="h-5 w-5" />} 
              label="العب" 
              active={location.pathname === '/play'} 
            />
            <NavItem 
              to="/leaderboard" 
              icon={<Award className="h-5 w-5" />} 
              label="التصنيف" 
              active={location.pathname === '/leaderboard'} 
            />
            <NavItem 
              to="/exchange" 
              icon={<DollarSign className="h-5 w-5" />} 
              label="استبدال النقاط" 
              active={location.pathname === '/exchange'} 
            />
          </div>
        </nav>
      )}

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 z-10">
        {children}
      </main>
      
      <footer className="w-full py-4 text-center text-sm text-muted-foreground z-10">
        جميع الحقوق محفوظة &copy; يوما {new Date().getFullYear()}
      </footer>
      
      {/* لا نعرض زر الواتساب على صفحات تسجيل الدخول والتسجيل لأننا أضفناه فيهم بالفعل */}
      {!isLoginPage && !isRegisterPage && (
        <>
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
        </>
      )}
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 ${
        active 
          ? 'bg-primary text-primary-foreground shadow-md' 
          : 'bg-card hover:bg-accent'
      }`}
    >
      {icon}
      <span className="mt-1 text-sm font-medium">{label}</span>
    </Link>
  );
};

export default Layout;
