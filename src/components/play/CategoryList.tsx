
import React from 'react';
import { QuizCategory } from '../../data/quizData';
import { Clock } from 'lucide-react';
import { iconMap } from './IconMap';

interface CategoryListProps {
  categories: QuizCategory[];
  onSelectCategory: (categoryId: string) => void;
  canPlayCategory: (categoryId: string) => boolean;
  getTimeRemaining: (categoryId: string) => string;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onSelectCategory,
  canPlayCategory,
  getTimeRemaining,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          disabled={!canPlayCategory(category.id)}
          className={`p-4 rounded-lg border-2 transition-all flex flex-col h-48 relative overflow-hidden
            ${category.id === 'ramadan' 
              ? 'border-amber-500 hover:bg-amber-500/10 hover:border-amber-400' 
              : canPlayCategory(category.id) 
                ? 'border-primary hover:bg-primary/10 hover:border-primary/80' 
                : 'border-muted cursor-not-allowed opacity-70'}`}
        >
          <div className="text-3xl mb-2">
            {category.id === 'ramadan' ? iconMap[category.id] : category.icon}
          </div>
          <h3 className={`text-xl font-bold mb-2 ${category.id === 'ramadan' ? 'text-amber-500' : ''}`}>
            {category.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
          
          {category.pointsPerQuestion && category.pointsPerQuestion > 1 && (
            <div className="absolute top-2 right-2 bg-amber-500 text-black text-xs px-2 py-1 rounded-full">
              {category.pointsPerQuestion} نقطة لكل إجابة صحيحة
            </div>
          )}
          
          {!canPlayCategory(category.id) && (
            <div className="absolute bottom-0 right-0 left-0 bg-muted/80 backdrop-blur-sm p-2 flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{getTimeRemaining(category.id)}</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryList;
