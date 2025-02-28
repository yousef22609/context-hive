
import React from 'react';
import { Timer } from 'lucide-react';

interface QuizHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  score: number;
  progress: number;
  categoryType: string;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentQuestionIndex,
  totalQuestions,
  timeLeft,
  score,
  progress,
  categoryType,
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-muted-foreground">السؤال</p>
          <p className="font-bold text-lg">{currentQuestionIndex + 1} من {totalQuestions}</p>
        </div>
        <div className="flex items-center bg-muted/30 px-3 py-1 rounded-full">
          <Timer className="h-4 w-4 mr-1 text-primary" />
          <span className="font-medium">{timeLeft} ثانية</span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">النقاط</p>
          <p className="font-bold text-lg">{score}</p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-muted/50 rounded-full h-2 mb-6">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ease-out ${
            categoryType === 'ramadan' ? 'bg-amber-500' : 'bg-primary'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
};

export default QuizHeader;
