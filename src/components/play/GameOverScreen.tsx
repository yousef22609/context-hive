
import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../context/UserContext';

interface GameOverScreenProps {
  score: number;
  answeredQuestions: number[];
  totalQuestions: number;
  user: User;
  categoryType: string;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  answeredQuestions,
  totalQuestions,
  user,
  categoryType,
  onRestart,
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="glass-card p-8 max-w-lg mx-auto animate-fade-in">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Star className={`h-16 w-16 ${categoryType === 'ramadan' ? 'text-amber-500' : 'text-primary'} animate-star-glow`} />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold">
              {score}
            </span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">انتهت اللعبة!</h1>
        <p className="text-lg mb-6">
          لقد أجبت على {answeredQuestions.length} من أصل {totalQuestions} أسئلة بشكل صحيح
        </p>
        
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <p className="font-medium">النقاط المكتسبة: {score}</p>
          <p className="text-sm text-muted-foreground">
            تمت إضافة النقاط إلى رصيدك: {user.points} نقطة
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onRestart} className="btn-primary">
            اختيار فئة أخرى
          </button>
          <button onClick={() => navigate('/')} className="btn-outline">
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
