
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import CategorySelection from '../components/play/CategorySelection';
import { Star, ChevronLeft, Users } from 'lucide-react';

const Play: React.FC = () => {
  const { user, logout, isAdmin, getUsersCount } = useUser();
  const navigate = useNavigate();

  // إذا لم يكن المستخدم قد سجل الدخول، قم بتوجيهه إلى صفحة تسجيل الدخول
  if (!user) {
    return (
      <Layout>
        <div className="glass-card p-8 animate-fade-in">
          <h2 className="text-xl font-bold text-center mb-4">يجب تسجيل الدخول أولاً</h2>
          <p className="text-center mb-6">قم بتسجيل الدخول للمشاركة في الاختبارات وكسب النقاط</p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <Link to="/login" className="btn-primary">
              تسجيل الدخول
            </Link>
            <Link to="/register" className="btn-secondary">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-full animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-primary">
            <ChevronLeft className="mr-1 h-5 w-5" />
            <span>الرئيسية</span>
          </Link>
          
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <Star className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="font-bold">{user.points} نقطة</span>
            </div>
            
            <button 
              onClick={() => logout()}
              className="text-sm text-muted-foreground hover:text-destructive"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
        
        {/* عرض معلومات المسؤول */}
        {isAdmin() && (
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center text-blue-800 dark:text-blue-300 font-medium mb-2">
              <Users className="h-5 w-5 mr-2" />
              <h3>لوحة المسؤول</h3>
            </div>
            <p className="text-blue-700 dark:text-blue-400">
              إجمالي عدد المستخدمين المسجلين: <span className="font-bold">{getUsersCount()}</span>
            </p>
          </div>
        )}
        
        <h1 className="text-2xl font-bold mb-6 text-center">اختر فئة واختبر معلوماتك!</h1>
        
        <CategorySelection />
      </div>
    </Layout>
  );
};

export default Play;
