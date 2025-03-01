
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { GameController, Trophy, DollarSign, User } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Welcome toast
      toast.success(`مرحباً بك ${user.username}! 👋`);
    }
  }, [user, navigate]);

  // Animation effect for the cards
  const cardHoverEffect = "transform transition-all duration-300 hover:scale-105 hover:shadow-lg";

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-10 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">مرحباً بك في لوحة التحكم</h1>
          <p className="text-muted-foreground">اختر ما تريد القيام به</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {/* بطاقة اللعب */}
          <Link 
            to="/play" 
            className={`glass-card p-8 flex flex-col items-center text-center ${cardHoverEffect} bg-gradient-to-br from-blue-500/10 to-blue-600/5 group`}
          >
            <div className="p-4 rounded-full bg-blue-500/10 mb-4 group-hover:bg-blue-500/30 transition-colors">
              <GameController className="h-10 w-10 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">العب الآن</h2>
            <p className="text-muted-foreground">اختبر معلوماتك واكسب النقاط</p>
            <div className="w-full h-1 bg-blue-500/20 mt-4 overflow-hidden">
              <div className="h-full w-0 bg-blue-500 group-hover:w-full transition-all duration-700"></div>
            </div>
          </Link>

          {/* بطاقة المتصدرين */}
          <Link 
            to="/leaderboard" 
            className={`glass-card p-8 flex flex-col items-center text-center ${cardHoverEffect} bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 group`}
          >
            <div className="p-4 rounded-full bg-yellow-500/10 mb-4 group-hover:bg-yellow-500/30 transition-colors">
              <Trophy className="h-10 w-10 text-yellow-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">المتصدرين</h2>
            <p className="text-muted-foreground">تعرف على أفضل اللاعبين</p>
            <div className="w-full h-1 bg-yellow-500/20 mt-4 overflow-hidden">
              <div className="h-full w-0 bg-yellow-500 group-hover:w-full transition-all duration-700"></div>
            </div>
          </Link>

          {/* بطاقة الاستبدال */}
          <Link 
            to="/exchange" 
            className={`glass-card p-8 flex flex-col items-center text-center ${cardHoverEffect} bg-gradient-to-br from-green-500/10 to-green-600/5 group`}
          >
            <div className="p-4 rounded-full bg-green-500/10 mb-4 group-hover:bg-green-500/30 transition-colors">
              <DollarSign className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">استبدال النقاط</h2>
            <p className="text-muted-foreground">حول نقاطك إلى مكافآت نقدية</p>
            <div className="w-full h-1 bg-green-500/20 mt-4 overflow-hidden">
              <div className="h-full w-0 bg-green-500 group-hover:w-full transition-all duration-700"></div>
            </div>
          </Link>
        </div>

        {/* بطاقة الملف الشخصي */}
        <div className="mt-8">
          <Link 
            to="/profile" 
            className={`glass-card p-6 flex items-center ${cardHoverEffect} bg-gradient-to-br from-purple-500/10 to-purple-600/5 group`}
          >
            <div className="p-3 rounded-full bg-purple-500/10 mr-4 group-hover:bg-purple-500/30 transition-colors">
              <User className="h-8 w-8 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold">الملف الشخصي</h2>
              <p className="text-muted-foreground">تحديث بياناتك الشخصية</p>
            </div>
            <div className="mr-auto">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-purple-500/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-purple-500" />
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* مؤشر النقاط */}
        <div className="mt-8 glass-card p-6">
          <h3 className="text-lg font-bold mb-2">رصيدك الحالي من النقاط</h3>
          <div className="flex items-center">
            <div className="w-full h-6 bg-primary/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000 flex items-center justify-end pr-3"
                style={{ width: `${Math.min(100, (user.points / 100) * 10)}%` }}
              >
                <span className="text-xs font-bold text-primary-foreground">{user.points}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
