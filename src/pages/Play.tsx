
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import CategorySelection from '../components/play/CategorySelection';
import { Star, ChevronLeft, Users } from 'lucide-react';
import { QuizCategory } from '../data/quizData';

// تحديد فئات الاختبارات
const categories: QuizCategory[] = [
  {
    id: 'general',
    name: 'معلومات عامة',
    description: 'اختبر معلوماتك العامة في مختلف المجالات',
    icon: '🌎',
    pointsPerQuestion: 1
  },
  {
    id: 'iq',
    name: 'اختبار الذكاء',
    description: 'تحدي قدراتك العقلية مع أسئلة منطقية صعبة',
    icon: '🧠',
    pointsPerQuestion: 2
  },
  {
    id: 'funny',
    name: 'أسئلة مرحة',
    description: 'استمتع مع مجموعة من الأسئلة الترفيهية المسلية',
    icon: '😂',
    pointsPerQuestion: 1
  },
  {
    id: 'ramadan',
    name: 'خاص برمضان',
    description: 'أسئلة خاصة بشهر رمضان الكريم والعبادات',
    icon: '🌙',
    pointsPerQuestion: 3
  }
];

const Play: React.FC = () => {
  const { user, logout, isAdmin, getUsersCount } = useUser();
  const navigate = useNavigate();
  const [playedCategories, setPlayedCategories] = useState<Record<string, Date>>({});

  useEffect(() => {
    // استرجاع الفئات التي تم لعبها من التخزين المحلي
    const storedCategories = localStorage.getItem(`played_categories_${user?.id}`);
    if (storedCategories) {
      const parsedCategories: Record<string, string> = JSON.parse(storedCategories);
      const convertedCategories: Record<string, Date> = {};
      
      // تحويل التواريخ المخزنة كنصوص إلى كائنات Date
      Object.keys(parsedCategories).forEach(key => {
        convertedCategories[key] = new Date(parsedCategories[key]);
      });
      
      setPlayedCategories(convertedCategories);
    }
  }, [user]);

  // التحقق مما إذا كان يمكن للمستخدم اللعب في فئة معينة
  const canPlayCategory = (categoryId: string): boolean => {
    if (!playedCategories[categoryId]) return true;
    
    const lastPlayed = playedCategories[categoryId];
    const now = new Date();
    const timeDiff = now.getTime() - lastPlayed.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff >= 24; // يسمح باللعب مرة واحدة كل 24 ساعة
  };
  
  // الحصول على الوقت المتبقي حتى يتمكن المستخدم من اللعب مرة أخرى
  const getTimeRemaining = (categoryId: string): string => {
    if (canPlayCategory(categoryId)) return "يمكنك اللعب الآن";
    
    const lastPlayed = playedCategories[categoryId];
    const now = new Date();
    const nextPlayTime = new Date(lastPlayed.getTime() + 24 * 60 * 60 * 1000);
    const remainingTime = nextPlayTime.getTime() - now.getTime();
    
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    
    return `متاح بعد ${hours} ساعة و ${minutes} دقيقة`;
  };
  
  // معالجة اختيار الفئة
  const handleSelectCategory = (categoryId: string) => {
    if (canPlayCategory(categoryId)) {
      // تخزين الفئة المحددة في التخزين المؤقت قبل الانتقال إلى صفحة الاختبار
      sessionStorage.setItem('selected_category', categoryId);
      navigate('/quiz');
    }
  };

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
        
        <CategorySelection 
          categories={categories}
          onSelectCategory={handleSelectCategory}
          canPlayCategory={canPlayCategory}
          getTimeRemaining={getTimeRemaining}
        />
      </div>
    </Layout>
  );
};

export default Play;
