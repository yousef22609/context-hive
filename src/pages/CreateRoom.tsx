
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Users, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// Helper function to generate a random room ID
const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const CreateRoom: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('4');
  const [isCreating, setIsCreating] = useState(false);

  if (!user) return null;

  const handleCreateRoom = async () => {
    if (!roomName) {
      toast.error('الرجاء إدخال اسم للغرفة');
      return;
    }

    setIsCreating(true);

    try {
      // For now, we'll simulate room creation with a random ID
      // In a real app, this would be created in Supabase
      const roomId = generateRoomId();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('تم إنشاء الغرفة بنجاح');
      navigate(`/room/${roomId}`);
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء الغرفة');
      console.error(error);
    } finally {
      setIsCreating(false);
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
        
        <Card className="backdrop-blur-sm bg-black/40 border-purple-900/50 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-white">إنشاء غرفة جديدة</CardTitle>
                <CardDescription className="text-gray-400">
                  أنشئ غرفة خاصة وشاركها مع أصدقائك
                </CardDescription>
              </div>
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
                <Flame className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="roomName" className="block text-sm font-medium text-gray-200">
                اسم الغرفة
              </label>
              <Input
                id="roomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full bg-black/50 border-gray-700 text-white"
                placeholder="أدخل اسم الغرفة"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-200">
                الحد الأقصى للاعبين
              </label>
              <select 
                id="maxPlayers"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-white"
              >
                <option value="2">2 لاعبين</option>
                <option value="3">3 لاعبين</option>
                <option value="4">4 لاعبين</option>
                <option value="5">5 لاعبين</option>
                <option value="6">6 لاعبين</option>
              </select>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white" 
              onClick={handleCreateRoom}
              disabled={isCreating}
            >
              {isCreating ? 'جاري الإنشاء...' : 'إنشاء الغرفة'}
              {!isCreating && <Users className="mr-2 h-5 w-5" />}
            </Button>
            
            <p className="text-sm text-gray-400 text-center">
              بعد إنشاء الغرفة، سيتم إعطاؤك رمزًا لمشاركته مع أصدقائك
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateRoom;
