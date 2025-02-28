import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LogOut, Star } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import DeveloperInfoDialog from './DeveloperInfoDialog';
import PromotionMessage from './PromotionMessage';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <AnimatedBackground />
      <header className="py-4 px-6 z-10 relative">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Star className="h-6 w-6 text-primary animate-star-glow mr-2" />
            <h1 className="text-xl font-bold">يوما كويز</h1>
          </Link>
          
          <nav>
            <ul className="flex items-center space-x-4 space-x-reverse rtl:space-x-reverse">
              {user ? (
                <>
                  <li>
                    <Link to="/play" className="link-hover">العب</Link>
                  </li>
                  <li>
                    <Link to="/leaderboard" className="link-hover">المتصدرين</Link>
                  </li>
                  <li>
                    <Link to="/exchange" className="link-hover">استبدال</Link>
                  </li>
                  <li className="mr-2">
                    <button 
                      onClick={handleLogout}
                      className="link-hover text-red-500"
                    >
                      <LogOut className="h-4 w-4 inline-block ml-1" />
                      خروج
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="btn-secondary">تسجيل الدخول</Link>
                  </li>
                  <li>
                    <Link to="/register" className="btn-primary">إنشاء حساب</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 p-6 z-0 relative">
        <PromotionMessage />
        {children}
      </main>
      
      <footer className="p-6 text-center text-sm text-muted-foreground z-10 relative">
        <p>جميع الحقوق محفوظة لمنصة يوما كويز © {new Date().getFullYear()}</p>
        <div className="mt-2">
          <DeveloperInfoDialog />
        </div>
      </footer>
    </div>
  );
};

export default Layout;
