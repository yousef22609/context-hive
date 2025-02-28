
import React from 'react';
import { QuizCategory } from '../../data/quizData';
import CategoryList from './CategoryList';
import PromotionMessage from '../PromotionMessage';

interface CategorySelectionProps {
  categories: QuizCategory[];
  onSelectCategory: (categoryId: string) => void;
  canPlayCategory: (categoryId: string) => boolean;
  getTimeRemaining: (categoryId: string) => string;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({
  categories,
  onSelectCategory,
  canPlayCategory,
  getTimeRemaining,
}) => {
  return (
    <div className="min-h-screen">
      <PromotionMessage />
      
      <div className="glass-card p-6 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-2xl font-bold text-center mb-8">اختر فئة الأسئلة</h1>
        
        <CategoryList 
          categories={categories}
          onSelectCategory={onSelectCategory}
          canPlayCategory={canPlayCategory}
          getTimeRemaining={getTimeRemaining}
        />
        
        <div className="text-center text-sm text-muted-foreground">
          <p>كل مجموعة أسئلة تحتوي على 10 أسئلة مختلفة عشوائياً من مجموعة الأسئلة الكاملة.</p>
          <p>تحصل على النقاط لكل إجابة صحيحة ويمكنك اللعب في كل فئة مرة واحدة كل 24 ساعة.</p>
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;
