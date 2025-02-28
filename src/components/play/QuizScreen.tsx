
import React from 'react';
import { Moon } from 'lucide-react';
import { QuizQuestion as QuizQuestionType } from '../../data/quizData';
import QuizHeader from './QuizHeader';
import QuizQuestion from './QuizQuestion';

interface QuizScreenProps {
  currentQuestion: QuizQuestionType;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  score: number;
  progress: number;
  selectedOption: string | null;
  isCorrect: boolean | null;
  handleOptionSelect: (option: string) => void;
  categoryType: string;
  pointsPerQuestion: number;
}

const QuizScreen: React.FC<QuizScreenProps> = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  timeLeft,
  score,
  progress,
  selectedOption,
  isCorrect,
  handleOptionSelect,
  categoryType,
  pointsPerQuestion,
}) => {
  return (
    <>
      <div className="glass-card p-6 max-w-2xl mx-auto animate-fade-in">
        {categoryType === 'ramadan' && (
          <div className="flex justify-center mb-4">
            <Moon className="h-10 w-10 text-amber-400 animate-pulse" />
          </div>
        )}
        
        <QuizHeader 
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          timeLeft={timeLeft}
          score={score}
          progress={progress}
          categoryType={categoryType}
        />
        
        <QuizQuestion
          question={currentQuestion.question}
          options={currentQuestion.options}
          selectedOption={selectedOption}
          isCorrect={isCorrect}
          correctAnswer={currentQuestion.correctAnswer}
          onSelectOption={handleOptionSelect}
          categoryType={categoryType}
          pointsPerQuestion={pointsPerQuestion}
        />
      </div>
      
      {categoryType === 'ramadan' && (
        <div className="fixed bottom-4 right-4 left-4 flex justify-center pointer-events-none">
          <div className="flex items-center space-x-4 rtl:space-x-reverse opacity-50">
            <Moon className="h-6 w-6 text-amber-400" />
            <Moon className="h-5 w-5 text-amber-200" />
            <Moon className="h-6 w-6 text-amber-400" />
          </div>
        </div>
      )}
    </>
  );
};

export default QuizScreen;
