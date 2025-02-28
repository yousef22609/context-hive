
import React from 'react';
import { Check, X } from 'lucide-react';

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedOption: string | null;
  isCorrect: boolean | null;
  correctAnswer: string;
  onSelectOption: (option: string) => void;
  categoryType: string;
  pointsPerQuestion: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  selectedOption,
  isCorrect,
  correctAnswer,
  onSelectOption,
  categoryType,
  pointsPerQuestion,
}) => {
  return (
    <div className="mb-8 py-3">
      <h2 className={`text-xl font-bold mb-6 text-center ${
        categoryType === 'ramadan' ? 'text-amber-100' : ''
      }`}>
        {question}
      </h2>
      
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelectOption(option)}
            disabled={selectedOption !== null}
            className={`w-full text-right p-4 rounded-lg border transition-all ${
              selectedOption === option
                ? isCorrect
                  ? 'bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-600'
                  : 'bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-600'
                : option === correctAnswer && isCorrect === false
                ? 'bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-600'
                : categoryType === 'ramadan'
                ? 'hover:bg-amber-500/20 hover:border-amber-400 border-amber-500/50'
                : 'hover:bg-accent hover:border-accent'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {selectedOption === option && isCorrect !== null && (
                isCorrect ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )
              )}
              {option === correctAnswer && selectedOption !== option && isCorrect === false && (
                <Check className="h-5 w-5 text-green-600" />
              )}
            </div>
          </button>
        ))}
      </div>
      
      {categoryType === 'ramadan' && (
        <div className="mt-6 text-center text-sm text-amber-200/70">
          <p>كل إجابة صحيحة تمنحك {pointsPerQuestion} نقاط!</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
