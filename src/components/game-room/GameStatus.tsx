
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Crown, Timer } from 'lucide-react';

interface GameStatusProps {
  gameStarted: boolean;
  isCurrentPlayer: boolean;
  currentPlayerName: string;
  roundTime: number;
  secretWord: string;
  onSecretWordChange: (word: string) => void;
  onConfirmWord: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({
  gameStarted,
  isCurrentPlayer,
  currentPlayerName,
  roundTime,
  secretWord,
  onSecretWordChange,
  onConfirmWord
}) => {
  if (!gameStarted) return null;

  return (
    <Card className="mb-4 bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-900/50">
      <CardHeader className="py-3">
        <CardTitle className="text-lg text-white flex justify-between">
          <div className="flex items-center">
            <Crown className="mr-2 h-5 w-5 text-yellow-500" />
            <span>
              {isCurrentPlayer 
                ? 'أنت تختار الكلمة السرية' 
                : `الكلمة السرية يختارها: ${currentPlayerName}`}
            </span>
          </div>
          <div className="flex items-center">
            <Timer className="mr-2 h-5 w-5 text-orange-500" />
            <span className={`${roundTime <= 10 ? 'text-red-500' : ''}`}>
              {roundTime} ثانية
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      {isCurrentPlayer && (
        <CardContent className="py-2">
          <div className="flex space-x-2 space-x-reverse">
            <Input 
              value={secretWord}
              onChange={(e) => onSecretWordChange(e.target.value)}
              className="bg-black/50 border-gray-700 text-white"
              placeholder="أدخل الكلمة السرية هنا"
            />
            <Button 
              onClick={onConfirmWord}
              className="bg-green-600 hover:bg-green-700"
            >
              تأكيد
            </Button>
          </div>
          <p className="text-sm text-gray-300 mt-2">
            اختر كلمة مناسبة وتحدى الآخرين لتخمينها!
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default GameStatus;
