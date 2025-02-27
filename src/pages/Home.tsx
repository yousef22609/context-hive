
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { Star, Award, DollarSign, User } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useUser();

  if (user) {
    return (
      <Layout>
        <div className="animate-fade-in space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">مرحباً بك في يوما</h1>
            <p className="text-muted-foreground">
              اختبر معلوماتك واربح النقاط!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              to="/play"
              icon={<Star className="h-10 w-10 text-primary" />}
              title="العب الآن"
              description="10 أسئلة مضحكة وممتعة"
              actionText="ابدأ اللعب"
            />
            <FeatureCard
              to="/leaderboard"
              icon={<Award className="h-10 w-10 text-primary" />}
              title="المتصدرين"
              description="اكتشف ترتيبك بين اللاعبين"
              actionText="عرض التصنيف"
            />
            <FeatureCard
              to="/exchange"
              icon={<DollarSign className="h-10 w-10 text-primary" />}
              title="استبدل نقاطك"
              description="حول نقاطك إلى أموال حقيقية"
              actionText="استبدال النقاط"
            />
          </div>
          
          <div className="glass-card p-6 mt-8">
            <div className="flex items-center space-x-4 justify-between space-x-reverse">
              <div className="flex items-center space-x-4 space-x-reverse">
                <User className="h-12 w-12 text-primary bg-primary/10 p-2 rounded-full" />
                <div>
                  <h3 className="font-bold text-lg">{user.username}</h3>
                  <p className="text-muted-foreground text-sm">الملف الشخصي</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">رصيدك الحالي</p>
                <p className="font-bold text-xl">{user.points} نقطة</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">رقم الهاتف للتحويل:</span>
                <span className="font-medium">{user.cashNumber || 'لم يتم تحديد رقم'}</span>
              </div>
              <Link to="/exchange" className="btn-outline w-full mt-4">
                تحديث معلومات الحساب
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center animate-fade-in py-12">
        <Star className="h-16 w-16 text-primary animate-star-glow mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-center">مرحباً بك في يوما</h1>
        <p className="text-xl text-muted-foreground text-center max-w-md mb-8">
          اختبر معلوماتك، اربح النقاط، واستبدلها بجوائز حقيقية!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/login" className="btn-primary text-center py-3 px-8">
            تسجيل الدخول
          </Link>
          <Link to="/register" className="btn-outline text-center py-3 px-8">
            إنشاء حساب جديد
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <FeatureBox 
            icon={<Star className="h-8 w-8 text-primary" />}
            title="العب واختبر معلوماتك"
            description="10 أسئلة مضحكة وممتعة مع وقت محدد لكل سؤال"
          />
          <FeatureBox 
            icon={<Award className="h-8 w-8 text-primary" />}
            title="تصنيف اللاعبين"
            description="تنافس مع اللاعبين الآخرين وارتق في قائمة المتصدرين"
          />
          <FeatureBox 
            icon={<DollarSign className="h-8 w-8 text-primary" />}
            title="استبدل نقاطك"
            description="حول النقاط التي تربحها إلى أموال حقيقية مباشرة إلى هاتفك"
          />
        </div>
      </div>
    </Layout>
  );
};

interface FeatureBoxProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ icon, title, description }) => {
  return (
    <div className="glass-card p-6 flex flex-col items-center text-center">
      <div className="bg-primary/10 p-3 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

interface FeatureCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ to, icon, title, description, actionText }) => {
  return (
    <div className="glass-card overflow-hidden card-hover">
      <div className="p-6">
        <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
          {icon}
        </div>
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="bg-muted/50 p-4 border-t">
        <Link to={to} className="btn-primary w-full text-center">
          {actionText}
        </Link>
      </div>
    </div>
  );
};

export default Home;
