
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Crown, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface GameHeaderProps {
  roomId: string;
  isHost: boolean;
  gameStarted: boolean;
  playersCount: number;
  onStartGame: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  roomId,
  isHost,
  gameStarted,
  playersCount,
  onStartGame
}) => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    if (playersCount < 2) {
      toast.error('تحتاج إلى لاعبين على الأقل لبدء اللعبة');
      return;
    }
    onStartGame();
  };

  const handleLeaveRoom = () => {
    navigate('/dashboard');
    toast.info('لقد غادرت الغرفة');
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold text-white flex items-center">
        <Flame className="mr-2 h-6 w-6 text-orange-500" />
        غرفة: {roomId}
      </h1>
      
      <div className="flex items-center space-x-4 space-x-reverse">
        {isHost && !gameStarted && (
          <Button 
            onClick={handleStartGame}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white"
          >
            بدء الجولة
            <Crown className="mr-2 h-4 w-4" />
          </Button>
        )}
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              مغادرة الغرفة
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-black/80 border border-red-900/50">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">تأكيد المغادرة</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                هل أنت متأكد من رغبتك في مغادرة الغرفة؟
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent text-gray-300 hover:bg-gray-800">إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={handleLeaveRoom} className="bg-red-600 hover:bg-red-700">مغادرة</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default GameHeader;
