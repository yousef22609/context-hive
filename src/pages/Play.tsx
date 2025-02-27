
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { quizQuestions } from '../data/quizData';
import { Check, X, Timer, Star } from 'lucide-react';

const Play: React.FC = () => {
  const { user, addPoints } = useUser();
  const navigate = useNavigate();
  
  // اختيار 10 أسئلة عشوائية من مجموعة الأسئلة المتاحة
  const randomQuestions = useMemo(() => {
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, []);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Timer countdown
  useEffect(() => {
    if (gameOver || isCorrect !== null) return;
    
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
  }, [currentQuestionIndex, isCorrect, gameOver]);
  
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
      setScore(prev => prev + 1);
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
  }, [currentQuestionIndex, selectedOption, isCorrect, randomQuestions]);
  
  const finishGame = useCallback(() => {
    setGameOver(true);
    addPoints(score);
  }, [score, addPoints]);
  
  const restartGame = useCallback(() => {
    // تحديث الصفحة لجلب أسئلة جديدة عشوائية
    window.location.reload();
  }, []);
  
  if (!user) return null;
  
  if (gameOver) {
    return (
      <Layout>
        <div className="glass-card p-8 max-w-lg mx-auto animate-fade-in">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Star className="h-16 w-16 text-primary animate-star-glow" />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold">
                  {score}
                </span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">انتهت اللعبة!</h1>
            <p className="text-lg mb-6">
              لقد أجبت على {score} من أصل {randomQuestions.length} أسئلة بشكل صحيح
            </p>
            
            <div className="bg-muted/30 rounded-lg p-4 mb-6">
              <p className="font-medium">النقاط المكتسبة: {score}</p>
              <p className="text-sm text-muted-foreground">
                تمت إضافة النقاط إلى رصيدك: {user.points} نقطة
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={restartGame} className="btn-primary">
                لعب مرة أخرى
              </button>
              <button onClick={() => navigate('/')} className="btn-outline">
                العودة للصفحة الرئيسية
              </button>
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
      <div className="glass-card p-6 max-w-2xl mx-auto animate-fade-in">
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
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mb-8 py-3">
          <h2 className="text-xl font-bold mb-6 text-center">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
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
        </div>
      </div>
    </Layout>
  );
};

export default Play;
