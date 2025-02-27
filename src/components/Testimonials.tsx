
import React from 'react';

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ name, role, content, avatar }) => {
  return (
    <div className="glass-card p-6">
      <div className="mb-4">
        <svg
          className="h-6 w-6 text-primary"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      
      <p className="mb-6 text-muted-foreground">{content}</p>
      
      <div className="flex items-center">
        <img
          src={avatar}
          alt={name}
          className="h-10 w-10 rounded-full border-2 border-primary ml-3"
        />
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  return (
    <div className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="mb-4 text-3xl font-bold">ماذا يقول مستخدمينا</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          آراء حقيقية من مستخدمين حقيقيين استفادوا من منصتنا
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Testimonial 
          name="أحمد محمد"
          role="مستخدم منذ 3 أشهر"
          content="تطبيق رائع ومميز، استطعت جمع نقاط كثيرة وتحويلها لرصيد على هاتفي. الأسئلة متنوعة وممتعة وتساعد على زيادة المعلومات العامة."
          avatar="https://i.pravatar.cc/150?img=1"
        />
        
        <Testimonial 
          name="سارة أحمد"
          role="مستخدمة منذ شهر"
          content="في البداية كنت أظن أنه مجرد موقع للتسلية، لكنني فعلاً جمعت نقاط كثيرة واستبدلتها بمبالغ حقيقية. شكراً للمطور على هذه الفكرة الرائعة!"
          avatar="https://i.pravatar.cc/150?img=5"
        />
        
        <Testimonial 
          name="محمد علي"
          role="مستخدم منذ 6 أشهر"
          content="أقضي أوقات فراغي في الإجابة على الأسئلة وجمع النقاط. الفكرة مبتكرة والتطبيق سهل الاستخدام، وأهم شيء أن عملية تحويل النقاط إلى أموال سريعة وموثوقة."
          avatar="https://i.pravatar.cc/150?img=3"
        />
      </div>
    </div>
  );
};

export default Testimonials;
