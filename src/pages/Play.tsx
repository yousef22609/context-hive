
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { quizCategories } from '../data/quizData';
import { toast } from 'sonner';
import CategorySelection from '../components/play/CategorySelection';
import QuizScreen from '../components/play/QuizScreen';
import GameOverScreen from '../components/play/GameOverScreen';

const Play: React.FC = () => {
  const { user, addPoints, canPlayQuizCategory, updateLastPlayedQuiz, getTimeRemaining } = useUser();
  const navigate = useNavigate();
  
  // حالة اختيار الفئة
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // حالات صفحة اللعب
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  
  // اختيار أسئلة عشوائية من الفئة المختارة
  const randomQuestions = useMemo(() => {
    if (!selectedCategory) return [];
    
    const category = quizCategories.find(cat => cat.id === selectedCategory);
    if (!category) return [];
    
    const shuffled = [...category.questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, [selectedCategory]);
  
  // الفئة المختارة كاملة
  const selectedCategoryData = useMemo(() => {
    if (!selectedCategory) return null;
    return quizCategories.find(cat => cat.id === selectedCategory) || null;
  }, [selectedCategory]);
  
  // القيمة النقطية لكل سؤال
  const pointsPerQuestion = useMemo(() => {
    return selectedCategoryData?.pointsPerQuestion || 1;
  }, [selectedCategoryData]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Timer countdown during game
  useEffect(() => {
    if (!selectedCategory || gameOver || isCorrect !== null || randomQuestions.length === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestionIndex, isCorrect, gameOver, selectedCategory, randomQuestions.length]);
  
  const handleCategorySelect = (categoryId: string) => {
    if (!canPlayQuizCategory(categoryId)) {
      toast.error(`لا يمكنك لعب هذه الفئة الآن. ${getTimeRemaining(categoryId)}`);
      return;
    }
    
    // رسالة تنبيهية لفوازير رمضان
    if (categoryId === 'ramadan') {
      toast.info('جاوب بعقل! سؤال هنا بـ 10 نقاط لو صح', { duration: 5000 });
    }
    
    setSelectedCategory(categoryId);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setAnsweredQuestions([]);
  };
  
  const handleTimeout = useCallback(() => {
    setIsCorrect(false);
    setTimeout(() => {
      if (currentQuestionIndex < randomQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        setTimeLeft(60);
      } else {
        finishGame();
      }
    }, 1500);
  }, [currentQuestionIndex, randomQuestions.length]);
  
  const handleOptionSelect = useCallback((option: string) => {
    if (selectedOption || isCorrect !== null) return;
    
    setSelectedOption(option);
    const currentQuestion = randomQuestions[currentQuestionIndex];
    const correct = option === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + pointsPerQuestion);
      setAnsweredQuestions(prev => [...prev, currentQuestionIndex]);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < randomQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        setTimeLeft(60);
      } else {
        finishGame();
      }
    }, 1500);
  }, [currentQuestionIndex, selectedOption, isCorrect, randomQuestions, pointsPerQuestion]);
  
  const finishGame = useCallback(() => {
    setGameOver(true);
    addPoints(score);
    
    // تحديث وقت آخر لعبة للفئة
    if (selectedCategory) {
      updateLastPlayedQuiz(selectedCategory);
    }
  }, [score, addPoints, selectedCategory, updateLastPlayedQuiz]);
  
  const restartGame = useCallback(() => {
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setAnsweredQuestions([]);
  }, []);
  
  if (!user) return null;
  
  // تحديد خلفية للصفحة بناءً على الفئة المختارة
  const getPageBackground = () => {
    if (selectedCategory === 'ramadan') {
      return "bg-gradient-to-b from-indigo-900/80 via-purple-900/80 to-indigo-900/80";
    }
    return "";
  };
  
  // حساب نسبة التقدم
  const progress = (currentQuestionIndex / randomQuestions.length) * 100;
  
  return (
    <Layout>
      <div className={`min-h-screen ${getPageBackground()}`}>
        {!selectedCategory && (
          <CategorySelection 
            categories={quizCategories}
            onSelectCategory={handleCategorySelect}
            canPlayCategory={canPlayQuizCategory}
            getTimeRemaining={getTimeRemaining}
          />
        )}
        
        {selectedCategory && !gameOver && randomQuestions.length > 0 && (
          <QuizScreen 
            currentQuestion={randomQuestions[currentQuestionIndex]}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={randomQuestions.length}
            timeLeft={timeLeft}
            score={score}
            progress={progress}
            selectedOption={selectedOption}
            isCorrect={isCorrect}
            handleOptionSelect={handleOptionSelect}
            categoryType={selectedCategory}
            pointsPerQuestion={pointsPerQuestion}
          />
        )}
        
        {gameOver && user && (
          <GameOverScreen 
            score={score}
            answeredQuestions={answeredQuestions}
            totalQuestions={randomQuestions.length}
            user={user}
            categoryType={selectedCategory || ''}
            onRestart={restartGame}
          />
        )}
      </div>
    </Layout>
  );
};

export default Play;
