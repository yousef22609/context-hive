
import React from 'react';
import { X } from 'lucide-react';
import { useUser } from '../context/UserContext';

const PromotionMessage: React.FC = () => {
  const { user, hidePromotion } = useUser();
  
  if (!user || !user.showPromotion) {
    return null;
  }
  
  return (
    <div className="fixed top-20 right-4 left-4 md:right-auto md:left-auto md:top-24 md:max-w-md mx-auto z-50">
      <div className="animate-bounce-slow bg-gradient-to-r from-amber-500 to-yellow-400 p-4 rounded-lg shadow-lg text-black">
        <button 
          onClick={hidePromotion}
          className="absolute top-2 right-2 text-gray-800 hover:text-black"
          aria-label="إغلاق"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center">
          <h3 className="font-bold text-lg mb-2">🎁 عرض خاص! 🎁</h3>
          <p className="mb-2">أجب على جميع الأسئلة بشكل صحيح والتقط صورة للشاشة</p>
          <p className="mb-2">أرسل الصورة على واتساب <span dir="ltr">01007570190</span></p>
          <p className="font-bold">وادخل السحب على حساب بريميوم و 100 جنيه كاش يوميًا!</p>
        </div>
      </div>
    </div>
  );
};

export default PromotionMessage;
