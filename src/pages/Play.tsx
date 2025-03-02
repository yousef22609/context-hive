
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext';
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
    pointsPerQuestion: 1,
    questions: [],
    cooldownHours: 24
  },
  {
    id: 'iq',
    name: 'اختبار الذكاء',
    description: 'تحدي قدراتك العقلية مع أسئلة منطقية صعبة',
    icon: '🧠',
    pointsPerQuestion: 2,
    questions: [],
    cooldownHours: 24
  },
  {
    id: 'funny',
    name: 'أسئلة مرحة',
    description: 'استمتع مع مجموعة من الأسئلة الترفيهية المسلية',
    icon: '😂',
    pointsPerQuestion: 1,
    questions: [],
    cooldownHours: 24
  },
  {
    id: 'ramadan',
    name: 'خاص برمضان',
    description: 'أسئلة خاصة بشهر رمضان الكريم والعبادات',
    icon: '🌙',
    pointsPerQuestion: 3,
    questions: [],
    cooldownHours: 24
  }
];

const Play: React.FC = () => {
  const { user, logout, isAdmin, getUsersCount, canPlayQuizCategory, getTimeRemaining, updateLastPlayedQuiz } = useUser();
  
  // معالجة اختيار الفئة
  const handleSelectCategory = (categoryId: string) => {
    if (canPlayQuizCategory(categoryId)) {
      // تخزين الفئة المحددة في التخزين المؤقت قبل الانتقال إلى صفحة الاختبار
      sessionStorage.setItem('selected_category', categoryId);
      updateLastPlayedQuiz(categoryId);
      // Navigate to quiz
      window.location.href = '/quiz';
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-primary">
            <ChevronLeft className="mr-1 h-5 w-5" />
            <span>لوحة التحكم</span>
          </Link>
          
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <Star className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="font-bold">{user?.points} نقطة</span>
            </div>
          </div>
        </div>
        
        {/* عرض معلومات المسؤول */}
        {isAdmin && isAdmin() && (
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
          canPlayCategory={canPlayQuizCategory}
          getTimeRemaining={getTimeRemaining}
        />
      </div>
    </Layout>
  );
};

export default Play;
