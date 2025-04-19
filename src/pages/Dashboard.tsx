
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Trophy, ArrowRight, Flame } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-lg mb-8 backdrop-blur-sm bg-black/30 border border-purple-900/50 p-6 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-orange-700/20 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1 text-white flex items-center">
                  <span className="ml-2">مرحبًا،</span> 
                  <span className="text-orange-500">{user.username}</span>
                  <Flame className="ml-2 h-6 w-6 text-orange-500" />
                </h1>
                <p className="text-gray-300">استعد للتحدي والمنافسة في نار التحدي!</p>
              </div>
              <div className="text-right">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 rounded-lg shadow-lg inline-block">
                  <span className="text-sm text-white">نقاطك الحالية</span>
                  <div className="text-2xl font-bold text-white mt-1">{user.points}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gradient-to-br from-purple-900/40 to-black/40 border-purple-900/30 shadow-lg hover:shadow-purple-900/20 transition-all">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Users className="mr-2 h-6 w-6 text-purple-400" />
                إنشاء غرفة جديدة
              </CardTitle>
              <CardDescription className="text-gray-400">
                أنشئ غرفة خاصة للعب مع أصدقائك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                قم بإنشاء غرفة خاصة وشارك الرمز مع أصدقائك للانضمام والتنافس معًا في لعبة تخمين الكلمات!
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white" onClick={() => navigate('/create-room')}>
                إنشاء غرفة جديدة
                <Flame className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/40 to-black/40 border-orange-900/30 shadow-lg hover:shadow-orange-900/20 transition-all">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <UserPlus className="mr-2 h-6 w-6 text-orange-400" />
                انضمام إلى غرفة
              </CardTitle>
              <CardDescription className="text-gray-400">
                انضم إلى أصدقائك في غرفة موجودة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                هل لديك رمز غرفة؟ انضم إلى أصدقائك وشارك في المرح والتحدي معهم الآن!
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-orange-700 text-orange-500 hover:bg-orange-950/50 hover:text-orange-300" onClick={() => navigate('/join-room')}>
                انضمام إلى غرفة
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Game Info & Stats Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-black/30 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">لوحة المتصدرين</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="link" className="w-full justify-between text-gray-300 hover:text-orange-500" onClick={() => navigate('/leaderboard')}>
                <span>عرض أفضل اللاعبين</span>
                <Trophy className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">مكافآتك</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="w-full justify-between text-gray-300 hover:text-orange-500" onClick={() => navigate('/exchange')}>
                <span>استبدال النقاط</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">الملف الشخصي</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="w-full justify-between text-gray-300 hover:text-orange-500" onClick={() => navigate('/profile')}>
                <span>تعديل بياناتك</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
