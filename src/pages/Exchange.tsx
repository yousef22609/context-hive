
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { DollarSign, Smartphone, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Exchange: React.FC = () => {
  const { user, exchangePoints, updateCashNumber } = useUser();
  const navigate = useNavigate();
  
  const [cashNumber, setCashNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isExchanging, setIsExchanging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setCashNumber(user.cashNumber || '');
    }
  }, [user, navigate]);
  
  const pointExchangeOptions = [
    { points: 1000, cash: 100 },
    { points: 2000, cash: 200 },
    { points: 5000, cash: 500 },
    { points: 10000, cash: 1000 },
  ];
  
  const handleExchange = () => {
    if (!user || !selectedAmount) return;
    
    if (!cashNumber.trim()) {
      toast.error('يرجى إدخال رقم الهاتف لاستلام المبلغ');
      return;
    }
    
    setIsExchanging(true);
    
    // Simulate network delay
    setTimeout(() => {
      const success = exchangePoints(selectedAmount, cashNumber);
      
      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setSelectedAmount(null);
        }, 3000);
      }
      
      setIsExchanging(false);
    }, 1500);
  };
  
  const handleCashNumberUpdate = () => {
    if (!user) return;
    
    if (!cashNumber.trim()) {
      toast.error('يرجى إدخال رقم الهاتف');
      return;
    }
    
    updateCashNumber(cashNumber);
  };
  
  if (!user) return null;
  
  const canExchange = user.points >= (selectedAmount || Infinity);
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="text-center mb-8">
          <DollarSign className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold">استبدال النقاط</h1>
          <p className="text-muted-foreground">
            حول النقاط التي جمعتها إلى مبالغ نقدية حقيقية
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">اختر المبلغ المراد استبداله</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {pointExchangeOptions.map((option) => (
                  <button
                    key={option.points}
                    onClick={() => setSelectedAmount(option.points)}
                    className={`p-4 rounded-lg border text-center transition-all ${
                      selectedAmount === option.points 
                        ? 'border-primary bg-primary/10' 
                        : user.points < option.points
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:border-primary'
                    }`}
                    disabled={user.points < option.points}
                  >
                    <p className="font-bold text-2xl">{option.cash} <span className="text-sm">جنيه</span></p>
                    <p className="text-sm text-muted-foreground">{option.points} نقطة</p>
                  </button>
                ))}
              </div>
              
              <div className="mb-6">
                <label htmlFor="cashNumber" className="block text-sm font-medium mb-2">
                  رقم الهاتف لاستلام المبلغ
                </label>
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="cashNumber"
                      type="tel"
                      value={cashNumber}
                      onChange={(e) => setCashNumber(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 bg-background border rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      placeholder="أدخل رقم الهاتف"
                    />
                  </div>
                  {cashNumber !== user.cashNumber && (
                    <button
                      onClick={handleCashNumberUpdate}
                      className="mr-2 px-3 py-2 btn-secondary text-xs"
                    >
                      حفظ الرقم
                    </button>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleExchange}
                disabled={!selectedAmount || !canExchange || isExchanging || !cashNumber.trim()}
                className={`w-full btn-primary ${
                  (!selectedAmount || !canExchange || isExchanging || !cashNumber.trim()) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                {isExchanging 
                  ? 'جاري الاستبدال...' 
                  : selectedAmount 
                    ? `استبدال ${selectedAmount} نقطة` 
                    : 'اختر المبلغ أولاً'
                }
              </button>
              
              {showSuccess && (
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100 rounded-md flex items-center">
                  <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>تم الاستبدال بنجاح! سيتم إرسال المبلغ إلى هاتفك خلال 24 ساعة.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">رصيدك الحالي</h2>
            
            <div className="bg-primary/10 rounded-lg p-4 mb-6 text-center">
              <p className="text-3xl font-bold">{user.points}</p>
              <p className="text-muted-foreground">نقطة</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm">
                <span className="font-bold">معدل الاستبدال:</span> كل 1000 نقطة = 100 جنيه
              </p>
              
              <div className="bg-muted/30 p-3 rounded-md text-sm">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-1">ملاحظات هامة:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>يتم تحويل المبالغ خلال 24 ساعة عمل</li>
                      <li>الحد الأدنى للاستبدال هو 1000 نقطة</li>
                      <li>تأكد من صحة رقم الهاتف المدخل</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Exchange;
