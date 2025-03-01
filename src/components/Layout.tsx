
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LogOut, Star, User, LayoutDashboard } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import DeveloperInfoDialog from './DeveloperInfoDialog';
import PromotionMessage from './PromotionMessage';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

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
                    <Link to="/dashboard" className={`link-hover ${location.pathname === '/dashboard' ? 'text-primary font-medium' : ''}`}>
                      <span className="flex items-center">
                        <LayoutDashboard className="h-4 w-4 mr-1" />
                        لوحة التحكم
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/play" className={`link-hover ${location.pathname === '/play' ? 'text-primary font-medium' : ''}`}>العب</Link>
                  </li>
                  <li>
                    <Link to="/leaderboard" className={`link-hover ${location.pathname === '/leaderboard' ? 'text-primary font-medium' : ''}`}>المتصدرين</Link>
                  </li>
                  <li>
                    <Link to="/exchange" className={`link-hover ${location.pathname === '/exchange' ? 'text-primary font-medium' : ''}`}>استبدال</Link>
                  </li>
                  <li className="mr-4">
                    <Link to="/profile" className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-primary hover:shadow-md transition-all">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-primary" />
                      )}
                    </Link>
                  </li>
                </>
              ) : (
                location.pathname !== '/login' && location.pathname !== '/register' ? (
                  <>
                    <li>
                      <Link to="/login" className="btn-secondary">تسجيل الدخول</Link>
                    </li>
                    <li>
                      <Link to="/register" className="btn-primary">إنشاء حساب</Link>
                    </li>
                  </>
                ) : null
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
