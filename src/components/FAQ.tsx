
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-border py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-right"
      >
        <h3 className="text-lg font-medium">{question}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-primary" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      
      {isOpen && (
        <div className="mt-2 text-muted-foreground pr-6">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  return (
    <div className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="mb-4 text-3xl font-bold">الأسئلة الشائعة</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          إجابات على الأسئلة الأكثر شيوعاً حول منصتنا
        </p>
      </div>
      
      <div className="mx-auto max-w-3xl">
        <FAQItem 
          question="كيف يمكنني استبدال النقاط بأموال حقيقية؟"
          answer="يمكنك استبدال النقاط بمبالغ مالية عند جمع 1000 نقطة على الأقل. كل 1000 نقطة تساوي 100 جنيه يتم تحويلها إلى رقم هاتفك المسجل في حسابك."
        />
        
        <FAQItem 
          question="هل يمكنني لعب أكثر من مرة في اليوم؟"
          answer="نعم، يمكنك اللعب عدة مرات في اليوم. في كل مرة ستحصل على 10 أسئلة جديدة وعشوائية. كما يمكنك الحصول على مكافأة يومية عند تسجيل الدخول."
        />
        
        <FAQItem 
          question="كم من الوقت يستغرق تحويل النقاط إلى رصيد؟"
          answer="يتم تحويل النقاط إلى رصيد خلال 24 ساعة من عملية الاستبدال، وغالباً ما يتم التحويل في خلال ساعات قليلة."
        />
        
        <FAQItem 
          question="هل يمكنني تغيير رقم الهاتف المستخدم لاستلام المبالغ؟"
          answer="نعم، يمكنك تغيير رقم الهاتف الخاص بك من صفحة الملف الشخصي في أي وقت، وسيتم استخدام الرقم الجديد في عمليات التحويل المستقبلية."
        />
        
        <FAQItem 
          question="هل الأسئلة تتكرر؟"
          answer="لدينا قاعدة بيانات كبيرة من الأسئلة المتنوعة، ونضيف أسئلة جديدة باستمرار. في كل مرة تلعب فيها ستواجه أسئلة مختلفة ومتنوعة."
        />
      </div>
    </div>
  );
};

export default FAQ;
