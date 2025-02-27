
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { DollarSign, Phone, User, Award, Upload } from 'lucide-react';

const Exchange: React.FC = () => {
  const { user, exchangePoints, updateCashNumber, updateAvatar } = useUser();
  const navigate = useNavigate();
  
  const [points, setPoints] = useState(1000);
  const [cashNumber, setCashNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tab, setTab] = useState<'exchange' | 'profile'>('exchange');
  const [avatar, setAvatar] = useState<string>('');
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setCashNumber(user.cashNumber || '');
      setAvatar(user.avatar || '');
    }
  }, [user, navigate]);
  
  const handleExchange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate network delay
    setTimeout(() => {
      exchangePoints(points, cashNumber);
      setIsProcessing(false);
    }, 1000);
  };
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate network delay
    setTimeout(() => {
      updateCashNumber(cashNumber);
      if (avatar) {
        updateAvatar(avatar);
      }
      setIsProcessing(false);
    }, 500);
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // تحويل الصورة إلى صيغة base64
    const reader = new FileReader();
    reader.onloadend = () => {
      // تحديث الصورة في الحالة
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const cashAmount = (points / 1000) * 100;
  
  if (!user) return null;
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="text-center mb-8">
          <DollarSign className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold mb-2">استبدال النقاط</h1>
          <p className="text-muted-foreground">
            حول نقاطك إلى أموال حقيقية
          </p>
        </div>
        
        <div className="glass-card mb-8 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setTab('exchange')}
              className={`flex-1 py-3 px-4 font-medium text-center transition-colors ${
                tab === 'exchange' 
                  ? 'bg-primary/10 border-b-2 border-primary' 
                  : 'hover:bg-accent/50'
              }`}
            >
              استبدال النقاط
            </button>
            <button
              onClick={() => setTab('profile')}
              className={`flex-1 py-3 px-4 font-medium text-center transition-colors ${
                tab === 'profile' 
                  ? 'bg-primary/10 border-b-2 border-primary' 
                  : 'hover:bg-accent/50'
              }`}
            >
              معلومات الحساب
            </button>
          </div>
          
          <div className="p-6">
            {tab === 'exchange' ? (
              <>
                <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">رصيدك الحالي</p>
                    <p className="font-bold text-xl">{user.points} نقطة</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">يمكنك استبدال</p>
                    <p className="font-bold text-xl">
                      {Math.floor(user.points / 1000) * 100} جنيه
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleExchange} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="points" className="block text-sm font-medium">
                      النقاط المراد استبدالها
                    </label>
                    <div className="relative">
                      <input
                        id="points"
                        type="number"
                        min="1000"
                        step="1000"
                        max={user.points}
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                        className="w-full p-3 pr-20 border rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                        placeholder="أدخل عدد النقاط"
                        required
                      />
                      <div className="absolute left-0 top-0 h-full flex items-center px-3 text-muted-foreground">
                        نقطة
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      القيمة النقدية: {cashAmount} جنيه
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="cashNumber" className="block text-sm font-medium">
                      رقم الهاتف لاستلام المبلغ
                    </label>
                    <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-primary focus-within:border-primary overflow-hidden">
                      <span className="px-3 py-2 bg-muted">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                      </span>
                      <input
                        id="cashNumber"
                        type="tel"
                        value={cashNumber}
                        onChange={(e) => setCashNumber(e.target.value)}
                        className="flex-1 px-3 py-2 bg-transparent focus:outline-none"
                        placeholder="أدخل رقم الهاتف"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isProcessing || points > user.points || points < 1000}
                    className={`w-full btn-primary ${
                      (isProcessing || points > user.points || points < 1000) 
                        ? 'opacity-70 cursor-not-allowed' 
                        : ''
                    }`}
                  >
                    {isProcessing 
                      ? 'جاري الاستبدال...' 
                      : `استبدال ${points} نقطة بمبلغ ${cashAmount} جنيه`
                    }
                  </button>
                  
                  <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                    <p>ملاحظات:</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>الحد الأدنى للاستبدال هو 1000 نقطة (100 جنيه)</li>
                      <li>سيتم تحويل المبلغ خلال 24 ساعة من عملية الاستبدال</li>
                      <li>يرجى التأكد من صحة رقم الهاتف قبل الاستبدال</li>
                    </ul>
                  </div>
                </form>
              </>
            ) : (
              <div className="animate-fade-in">
                <div className="flex justify-center mb-6">
                  <div className="relative group">
                    <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                      {avatar ? (
                        <img 
                          src={avatar} 
                          alt={user.username} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-primary" />
                      )}
                    </div>
                    <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                      <Upload className="h-8 w-8 text-white" />
                    </label>
                    <input 
                      type="file" 
                      id="avatar-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">{user.username}</h2>
                  <div className="flex items-center justify-center mt-2">
                    <Award className="h-4 w-4 text-primary mr-1" />
                    <span className="text-muted-foreground">{user.points} نقطة</span>
                  </div>
                </div>
                
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="profileCashNumber" className="block text-sm font-medium">
                      رقم الهاتف للتحويل
                    </label>
                    <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-primary focus-within:border-primary overflow-hidden">
                      <span className="px-3 py-2 bg-muted">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                      </span>
                      <input
                        id="profileCashNumber"
                        type="tel"
                        value={cashNumber}
                        onChange={(e) => setCashNumber(e.target.value)}
                        className="flex-1 px-3 py-2 bg-transparent focus:outline-none"
                        placeholder="أدخل رقم الهاتف"
                        required
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      سيتم استخدام هذا الرقم لجميع عمليات استبدال النقاط
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full btn-primary ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isProcessing ? 'جاري الحفظ...' : 'حفظ المعلومات'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Exchange;
