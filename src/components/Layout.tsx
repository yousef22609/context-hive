
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LogOut, Star, User, LayoutDashboard, Flame } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import DeveloperInfoDialog from './DeveloperInfoDialog';
import PromotionMessage from './PromotionMessage';
import FireEffects from './FireEffects';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1F2C]" dir="rtl">
      <FireEffects />
      <header className="py-4 px-6 z-10 relative backdrop-blur-sm bg-black/20">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center">
            <Flame className="h-6 w-6 text-orange-500 animate-pulse mr-2" />
            <h1 className="text-xl font-bold text-white">
              <span className="text-orange-500">Zexs</span> - نار التحدي
            </h1>
          </Link>
          
          <nav>
            <ul className="flex items-center space-x-4 space-x-reverse rtl:space-x-reverse">
              {user && (
                <>
                  <li>
                    <Link to="/dashboard" className={`link-hover ${location.pathname === '/dashboard' ? 'text-orange-500 font-medium' : 'text-white'}`}>
                      <span className="flex items-center">
                        <LayoutDashboard className="h-4 w-4 mr-1" />
                        الرئيسية
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/rooms" className={`link-hover ${location.pathname === '/rooms' ? 'text-orange-500 font-medium' : 'text-white'}`}>الغرف</Link>
                  </li>
                  <li>
                    <Link to="/leaderboard" className={`link-hover ${location.pathname === '/leaderboard' ? 'text-orange-500 font-medium' : 'text-white'}`}>المتصدرين</Link>
                  </li>
                  <li>
                    <Link to="/exchange" className={`link-hover ${location.pathname === '/exchange' ? 'text-orange-500 font-medium' : 'text-white'}`}>استبدال النقاط</Link>
                  </li>
                  <li className="mr-4">
                    <Link to="/profile" className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-orange-500 hover:shadow-md hover:shadow-orange-500/50 transition-all">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-orange-500" />
                      )}
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="text-sm text-gray-300 hover:text-orange-500 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      خروج
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 p-6 z-0 relative">
        {children}
      </main>
      
      <footer className="p-6 text-center text-sm text-gray-400 z-10 relative">
        <p>جميع الحقوق محفوظة لمنصة Zexs © {new Date().getFullYear()}</p>
        <div className="mt-2">
          <DeveloperInfoDialog />
        </div>
      </footer>
    </div>
  );
};

export default Layout;
