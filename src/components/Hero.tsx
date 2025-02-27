
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden py-16 md:py-24">
      {/* خلفية متوهجة */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-background/0 to-background" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute left-1/4 bottom-1/3 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="animate-fade-in">
          <div className="mb-6 flex justify-center">
            <Star className="h-16 w-16 text-primary animate-[pulse_3s_ease-in-out_infinite]" />
          </div>
          
          <h1 className="mb-6 text-3xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-b from-white to-gray-400 dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
              منصة يوما - عالم من الأسئلة والتحديات
            </span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
            اختبر معلوماتك، نافس الآخرين، واربح النقاط التي يمكن تحويلها إلى مكافآت حقيقية!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary px-8 py-3 text-lg">
              تسجيل الدخول
            </Link>
            <Link to="/register" className="btn-outline px-8 py-3 text-lg">
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
