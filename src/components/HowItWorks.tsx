
import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <div className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-3xl font-bold">كيف تعمل المنصة؟</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            خطوات بسيطة تفصلك عن بدء اللعب وتحقيق المكافآت
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
              ١
            </div>
            <h3 className="mb-2 text-xl font-bold">أنشئ حسابك</h3>
            <p className="text-muted-foreground">
              قم بإنشاء حساب جديد في دقيقة واحدة فقط لتبدأ مغامرتك معنا
            </p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
              ٢
            </div>
            <h3 className="mb-2 text-xl font-bold">العب واجمع النقاط</h3>
            <p className="text-muted-foreground">
              أجب على الأسئلة بسرعة ودقة لتجمع أكبر عدد من النقاط وتتصدر اللوحة
            </p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
              ٣
            </div>
            <h3 className="mb-2 text-xl font-bold">استبدل نقاطك</h3>
            <p className="text-muted-foreground">
              حول النقاط التي جمعتها إلى أموال حقيقية يتم إرسالها إلى رقم هاتفك
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
