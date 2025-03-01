
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { ChevronLeft, Camera, User, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const avatarOptions = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5',
  'https://i.pravatar.cc/150?img=6',
  'https://i.pravatar.cc/150?img=7',
  'https://i.pravatar.cc/150?img=8',
  'https://i.pravatar.cc/150?img=9',
  'https://i.pravatar.cc/150?img=10',
];

const UserProfile: React.FC = () => {
  const { user, logout, updateAvatar, updateCashNumber } = useUser();
  const navigate = useNavigate();
  const [cashNumber, setCashNumber] = useState(user?.cashNumber || '');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // إذا لم يكن المستخدم قد سجل الدخول، قم بتوجيهه إلى صفحة تسجيل الدخول
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateCashNumber = () => {
    if (cashNumber.trim()) {
      updateCashNumber(cashNumber);
      toast.success('تم تحديث رقم الهاتف بنجاح');
    } else {
      toast.error('يرجى إدخال رقم الهاتف');
    }
  };

  const handleSelectAvatar = (avatar: string) => {
    updateAvatar(avatar);
    setShowAvatarSelector(false);
    toast.success('تم تحديث الصورة الشخصية بنجاح');
  };

  return (
    <Layout>
      <div className="w-full max-w-md mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-primary">
            <ChevronLeft className="mr-1 h-5 w-5" />
            <span>الرئيسية</span>
          </Link>
        </div>

        <div className="glass-card p-6">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="relative h-24 w-24 mx-auto rounded-full overflow-hidden border-4 border-primary">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.username} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow hover:bg-primary/90 transition-colors"
                aria-label="تغيير الصورة"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h1 className="text-xl font-bold mt-4">{user.username}</h1>
            <p className="text-muted-foreground text-sm">
              {user.points} نقطة
            </p>
          </div>

          {showAvatarSelector && (
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg mb-6 border">
              <h3 className="text-sm font-medium mb-3">اختر صورة شخصية</h3>
              <div className="grid grid-cols-5 gap-2">
                {avatarOptions.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAvatar(avatar)}
                    className="relative rounded-full overflow-hidden w-12 h-12 hover:ring-2 hover:ring-primary transition-all"
                  >
                    <img src={avatar} alt={`avatar option ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                اسم المستخدم
              </label>
              <input
                id="username"
                type="text"
                value={user.username}
                readOnly
                className="w-full px-3 py-2 bg-muted rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="cashNumber" className="block text-sm font-medium mb-1">
                رقم الهاتف للتواصل والاستبدال
              </label>
              <div className="flex gap-2">
                <input
                  id="cashNumber"
                  type="text"
                  value={cashNumber}
                  onChange={(e) => setCashNumber(e.target.value)}
                  placeholder="أدخل رقم الهاتف"
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleUpdateCashNumber}
                  className="btn-primary"
                >
                  تحديث
                </button>
              </div>
            </div>

            <div className="pt-4 border-t mt-6">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-destructive hover:text-destructive/90 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
