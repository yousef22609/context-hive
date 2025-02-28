
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { quizCategories } from '../data/quizData';
import { Check, X, Timer, Star, Clock, Brain, Laugh, Globe, Gamepad2, Moon, Lantern } from 'lucide-react';
import { toast } from 'sonner';
import PromotionMessage from '../components/PromotionMessage';

// خريطة الأيقونات لكل فئة
const iconMap: Record<string, React.ReactNode> = {
  'funny': <Laugh className="h-6 w-6" />,
  'iq': <Brain className="h-6 w-6" />,
  'general': <Globe className="h-6 w-6" />,
  'cartoon': <Gamepad2 className="h-6 w-6" />,
  'ramadan': <Lantern className="h-6 w-6 text-amber-500" />
};

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
  
  // إذا لم يتم اختيار فئة بعد، اعرض قائمة الفئات
  if (!selectedCategory) {
    return (
      <Layout>
        <div className={`min-h-screen ${getPageBackground()}`}>
          <PromotionMessage />
          
          <div className="glass-card p-6 max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-bold text-center mb-8">اختر فئة الأسئلة</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {quizCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  disabled={!canPlayQuizCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col h-48 relative overflow-hidden
                    ${category.id === 'ramadan' 
                      ? 'border-amber-500 hover:bg-amber-500/10 hover:border-amber-400' 
                      : canPlayQuizCategory(category.id) 
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
                  
                  {!canPlayQuizCategory(category.id) && (
                    <div className="absolute bottom-0 right-0 left-0 bg-muted/80 backdrop-blur-sm p-2 flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{getTimeRemaining(category.id)}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>كل مجموعة أسئلة تحتوي على 10 أسئلة مختلفة عشوائياً من مجموعة الأسئلة الكاملة.</p>
              <p>تحصل على النقاط لكل إجابة صحيحة ويمكنك اللعب في كل فئة مرة واحدة كل 24 ساعة.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (gameOver) {
    return (
      <Layout>
        <div className={`min-h-screen ${getPageBackground()}`}>
          <div className="glass-card p-8 max-w-lg mx-auto animate-fade-in">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Star className={`h-16 w-16 ${selectedCategory === 'ramadan' ? 'text-amber-500' : 'text-primary'} animate-star-glow`} />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold">
                    {score}
                  </span>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">انتهت اللعبة!</h1>
              <p className="text-lg mb-6">
                لقد أجبت على {answeredQuestions.length} من أصل {randomQuestions.length} أسئلة بشكل صحيح
              </p>
              
              <div className="bg-muted/30 rounded-lg p-4 mb-6">
                <p className="font-medium">النقاط المكتسبة: {score}</p>
                <p className="text-sm text-muted-foreground">
                  تمت إضافة النقاط إلى رصيدك: {user.points} نقطة
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={restartGame} className="btn-primary">
                  اختيار فئة أخرى
                </button>
                <button onClick={() => navigate('/')} className="btn-outline">
                  العودة للصفحة الرئيسية
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  const currentQuestion = randomQuestions[currentQuestionIndex];
  const progress = (currentQuestionIndex / randomQuestions.length) * 100;
  
  return (
    <Layout>
      <div className={`min-h-screen ${getPageBackground()}`}>
        <div className="glass-card p-6 max-w-2xl mx-auto animate-fade-in">
          {selectedCategory === 'ramadan' && (
            <div className="flex justify-center mb-4">
              <Lantern className="h-10 w-10 text-amber-400 animate-pulse" />
            </div>
          )}
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-muted-foreground">السؤال</p>
              <p className="font-bold text-lg">{currentQuestionIndex + 1} من {randomQuestions.length}</p>
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
                selectedCategory === 'ramadan' ? 'bg-amber-500' : 'bg-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="mb-8 py-3">
            <h2 className={`text-xl font-bold mb-6 text-center ${
              selectedCategory === 'ramadan' ? 'text-amber-100' : ''
            }`}>
              {currentQuestion?.question}
            </h2>
            
            <div className="space-y-3">
              {currentQuestion?.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                  className={`w-full text-right p-4 rounded-lg border transition-all ${
                    selectedOption === option
                      ? isCorrect
                        ? 'bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-600'
                        : 'bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-600'
                      : option === currentQuestion.correctAnswer && isCorrect === false
                      ? 'bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-600'
                      : selectedCategory === 'ramadan'
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
                    {option === currentQuestion.correctAnswer && selectedOption !== option && isCorrect === false && (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {selectedCategory === 'ramadan' && (
              <div className="mt-6 text-center text-sm text-amber-200/70">
                <p>كل إجابة صحيحة تمنحك {pointsPerQuestion} نقاط!</p>
              </div>
            )}
          </div>
        </div>
        
        {selectedCategory === 'ramadan' && (
          <div className="fixed bottom-4 right-4 left-4 flex justify-center pointer-events-none">
            <div className="flex items-center space-x-4 rtl:space-x-reverse opacity-50">
              <Lantern className="h-6 w-6 text-amber-400" />
              <Moon className="h-5 w-5 text-amber-200" />
              <Lantern className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Play;
