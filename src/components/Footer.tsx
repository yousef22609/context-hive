
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center gap-2">
              <Star className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">يوما</span>
            </Link>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              منصة الألعاب والأسئلة الأولى في الوطن العربي. اختبر معلوماتك واربح النقاط!
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4 text-sm">
            <div>
              <h3 className="mb-3 font-bold">الصفحات</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-muted-foreground hover:text-primary">الرئيسية</Link></li>
                <li><Link to="/play" className="text-muted-foreground hover:text-primary">العب الآن</Link></li>
                <li><Link to="/leaderboard" className="text-muted-foreground hover:text-primary">المتصدرين</Link></li>
                <li><Link to="/exchange" className="text-muted-foreground hover:text-primary">استبدال النقاط</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-3 font-bold">الحساب</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-muted-foreground hover:text-primary">تسجيل الدخول</Link></li>
                <li><Link to="/register" className="text-muted-foreground hover:text-primary">إنشاء حساب</Link></li>
                <li><Link to="/profile" className="text-muted-foreground hover:text-primary">الملف الشخصي</Link></li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1 mt-4 md:mt-0">
              <h3 className="mb-3 font-bold">تواصل معنا</h3>
              <a 
                href="https://wa.me/01007570190" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-green-500"
              >
                <MessageCircle className="h-4 w-4" />
                <span>01007570190</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-border text-sm">
          <p className="text-muted-foreground">
            جميع الحقوق محفوظة &copy; يوما {new Date().getFullYear()}
          </p>
          <div className="mt-4 md:mt-0">
            <span className="text-primary font-bold">المطور: يوسف هشام شعبان</span>
          </div>
        </div>
      </div>
      
      {/* زر واتساب للدعم */}
      <a 
        href="https://wa.me/01007570190" 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-btn"
        aria-label="تواصل معنا عبر واتساب"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      
      {/* اسم المطور */}
      <div className="developer-credit">
        المطور يوسف هشام شعبان
      </div>
    </footer>
  );
};

export default Footer;
