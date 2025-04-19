
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, UserPlus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const JoinRoom: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  if (!user) return null;

  const handleJoinRoom = async () => {
    if (!roomCode) {
      toast.error('الرجاء إدخال رمز الغرفة');
      return;
    }

    setIsJoining(true);

    try {
      // For demo purposes, we'll simulate a check and join
      // In a real app, this would validate against Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation - room code should be 6 characters
      if (roomCode.length !== 6) {
        toast.error('رمز الغرفة غير صالح');
        setIsJoining(false);
        return;
      }
      
      toast.success('تم الانضمام للغرفة بنجاح');
      navigate(`/room/${roomCode}`);
    } catch (error) {
      toast.error('حدث خطأ أثناء الانضمام للغرفة');
      console.error(error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto animate-fade-in">
        <div className="mb-8">
          <Button
            variant="outline" 
            className="border-gray-700 text-gray-300"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            العودة للرئيسية
          </Button>
        </div>
        
        <Card className="backdrop-blur-sm bg-black/40 border-orange-900/50 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-white">انضمام إلى غرفة</CardTitle>
                <CardDescription className="text-gray-400">
                  انضم إلى أصدقائك باستخدام رمز الغرفة
                </CardDescription>
              </div>
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
                <Flame className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="roomCode" className="block text-sm font-medium text-gray-200">
                رمز الغرفة
              </label>
              <Input
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full bg-black/50 border-gray-700 text-white text-center text-2xl tracking-widest"
                placeholder="أدخل رمز الغرفة"
                maxLength={6}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full bg-gradient-to-r from-orange-700 to-red-700 hover:from-orange-600 hover:to-red-600 text-white" 
              onClick={handleJoinRoom}
              disabled={isJoining}
            >
              {isJoining ? 'جاري الانضمام...' : 'انضمام للغرفة'}
              {!isJoining && <UserPlus className="mr-2 h-5 w-5" />}
            </Button>
            
            <p className="text-sm text-gray-400 text-center">
              تأكد من الحصول على رمز صحيح من صديقك
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default JoinRoom;
