
import React from 'react';
import { Star, Award, DollarSign } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="glass-card p-6 card-hover">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  return (
    <div className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="mb-4 text-3xl font-bold">ميزات المنصة</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          منصة تفاعلية متكاملة لاختبار معلوماتك وجمع النقاط وتحويلها إلى مكافآت حقيقية
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Star className="h-8 w-8 text-primary" />}
          title="العب وتحدى نفسك"
          description="أسئلة متنوعة في مختلف المجالات مع تحدي الوقت لاختبار سرعة بديهتك ومعلوماتك"
        />
        
        <FeatureCard 
          icon={<Award className="h-8 w-8 text-primary" />}
          title="نافس الآخرين"
          description="لوحة متصدرين تفاعلية تمكنك من معرفة ترتيبك بين اللاعبين وتحفزك للتقدم"
        />
        
        <FeatureCard 
          icon={<DollarSign className="h-8 w-8 text-primary" />}
          title="اربح مكافآت حقيقية"
          description="حول النقاط التي تجمعها إلى أموال حقيقية يتم إرسالها مباشرة إلى رقم هاتفك"
        />
      </div>
    </div>
  );
};

export default Features;
