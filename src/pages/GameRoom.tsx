
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Timer, Users, MessageSquare, Lightbulb, Flame, Crown, Send } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getRoomMembers, getRoomMessages, sendRoomMessage, 
  subscribeToRoomMembers, subscribeToRoomMessages,
  getCurrentRound, startNewRound, endRound,
  askQuestion, getRoundQuestions, useAIHelp
} from '../services/supabase';
import { RoomMember, RoomMessage, Round, RoundQuestion } from '../types/room';

const GameRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [players, setPlayers] = useState<RoomMember[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [roundTime, setRoundTime] = useState(60);
  const [secretWord, setSecretWord] = useState('');
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [questions, setQuestions] = useState<RoundQuestion[]>([]);
  const [aiHelpsUsed, setAiHelpsUsed] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Detect if user is host (room creator)
  const isHost = user && players.some(player => 
    player.user_id === user.id && player.room_id === roomId
  );
  
  // Current player is the one setting the word in the current round
  const isCurrentPlayer = currentRound?.setter_id === user?.id;
  const currentPlayerName = players.find(player => 
    player.user_id === currentRound?.setter_id
  )?.username || '';

  // Load room data on mount
  useEffect(() => {
    const loadRoomData = async () => {
      if (!roomId || !user) return;
      
      try {
        // Load players
        const roomMembers = await getRoomMembers(roomId);
        setPlayers(roomMembers);
        
        // Load messages
        const roomMessages = await getRoomMessages(roomId);
        setMessages(roomMessages);
        
        // Check if there's an active round
        const round = await getCurrentRound(roomId);
        if (round) {
          setCurrentRound(round);
          setGameStarted(true);
          
          // If user is the word setter, show the secret word input
          if (round.setter_id === user.id) {
            setSecretWord(round.word);
          }
          
          // Load questions for this round
          const roundQuestions = await getRoundQuestions(round.id);
          setQuestions(roundQuestions);
          
          // Calculate remaining time
          const startTime = new Date(round.start_time).getTime();
          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
          const remainingSeconds = Math.max(0, 60 - elapsedSeconds);
          setRoundTime(remainingSeconds);
          
          // Start timer if round is still active
          if (remainingSeconds > 0) {
            // Timer will be started in the timer effect
          }
        }
      } catch (error) {
        console.error("Error loading room data:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات الغرفة");
      }
    };
    
    loadRoomData();
  }, [roomId, user]);
  
  // Setup realtime subscriptions
  useEffect(() => {
    if (!roomId) return;
    
    // Subscribe to new messages
    const unsubscribeMessages = subscribeToRoomMessages(roomId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });
    
    // Subscribe to room members
    const unsubscribeMembers = subscribeToRoomMembers(roomId, (member, eventType) => {
      if (eventType === 'INSERT') {
        setPlayers(prev => [...prev, member]);
        toast.info(`${member.username || 'لاعب جديد'} انضم إلى الغرفة`);
      } else if (eventType === 'DELETE') {
        setPlayers(prev => prev.filter(p => p.id !== member.id));
        toast.info(`${member.username || 'لاعب'} غادر الغرفة`);
      }
    });
    
    return () => {
      unsubscribeMessages();
      unsubscribeMembers();
    };
  }, [roomId]);
  
  // Effect for countdown timer when game is active
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameStarted && currentRound && roundTime > 0) {
      timer = setInterval(() => {
        setRoundTime(prevTime => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            // End of round
            handleEndRound();
          }
          return newTime > 0 ? newTime : 0;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, currentRound, roundTime]);
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !roomId) return;
    
    try {
      const newMessage = await sendRoomMessage(roomId, user.id, message);
      setMessage('');
      
      // Check if message is a word guess in game mode
      if (gameStarted && currentRound && secretWord && 
          message.trim().toLowerCase() === currentRound.word.toLowerCase() &&
          user.id !== currentRound.setter_id) {
        // Correct guess!
        toast.success('تهانينا! لقد خمنت الكلمة الصحيحة!');
        handleEndRound(user.id);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("فشل إرسال الرسالة");
    }
  };
  
  const handleStartGame = async () => {
    if (players.length < 2) {
      toast.error('تحتاج إلى لاعبين على الأقل لبدء اللعبة');
      return;
    }
    
    // Select a random player to set the secret word
    const eligiblePlayers = players.filter(p => p.user_id !== user?.id);
    const randomPlayerIndex = Math.floor(Math.random() * eligiblePlayers.length);
    const selectedPlayer = eligiblePlayers[randomPlayerIndex];
    
    try {
      // Create a default word that will be updated by the selected player
      const round = await startNewRound(
        roomId || '', 
        selectedPlayer.user_id, 
        "كلمة_مؤقتة"
      );
      
      if (round) {
        setCurrentRound(round);
        setSecretWord('');
        setRoundTime(60);
        setGameStarted(true);
        setQuestions([]);
        
        // Add system message about round start
        const systemMessage: RoomMessage = {
          id: `system-${Date.now()}`,
          room_id: roomId || '',
          user_id: 'system',
          username: 'النظام',
          message: `بدأت جولة جديدة! ${selectedPlayer.username || 'اللاعب المختار'} سيختار الكلمة السرية`,
          sent_at: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, systemMessage]);
        
        toast.success('تم بدء الجولة! انتظر حتى يختار اللاعب المختار الكلمة السرية');
      }
    } catch (error) {
      console.error("Error starting game:", error);
      toast.error("حدث خطأ أثناء بدء اللعبة");
    }
  };
  
  const handleSetSecretWord = async () => {
    if (!secretWord.trim() || !currentRound || !roomId) {
      toast.error('الرجاء إدخال كلمة سرية');
      return;
    }
    
    try {
      // Update the round with the real word
      const updatedRound = await startNewRound(
        roomId,
        currentRound.setter_id,
        secretWord
      );
      
      if (updatedRound) {
        setCurrentRound(updatedRound);
        toast.success('تم تعيين الكلمة السرية! بدأت الجولة');
        
        // Add system message
        const systemMessage: RoomMessage = {
          id: `system-${Date.now()}`,
          room_id: roomId,
          user_id: 'system',
          username: 'النظام',
          message: `تم تعيين الكلمة السرية! ابدأوا بطرح الأسئلة`,
          sent_at: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, systemMessage]);
      }
    } catch (error) {
      console.error("Error setting secret word:", error);
      toast.error("حدث خطأ أثناء تعيين الكلمة السرية");
    }
  };
  
  const handleEndRound = async (winnerId?: string) => {
    if (!currentRound) return;
    
    try {
      await endRound(currentRound.id, winnerId);
      
      // Add system message
      const systemMessage: RoomMessage = {
        id: `system-${Date.now()}`,
        room_id: roomId || '',
        user_id: 'system',
        username: 'النظام',
        message: winnerId 
          ? `انتهت الجولة! الفائز: ${players.find(p => p.user_id === winnerId)?.username || 'اللاعب الفائز'}`
          : `انتهت الجولة! لم يتمكن أحد من تخمين الكلمة: ${currentRound.word}`,
        sent_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, systemMessage]);
      setGameStarted(false);
      setCurrentRound(null);
      
      toast.info(winnerId 
        ? `انتهت الجولة! الفائز هو ${players.find(p => p.user_id === winnerId)?.username || 'اللاعب الفائز'}`
        : 'انتهت الجولة! لم يتمكن أحد من تخمين الكلمة'
      );
      
      // Reset round state
      setRoundTime(0);
      setSecretWord('');
      setQuestions([]);
    } catch (error) {
      console.error("Error ending round:", error);
      toast.error("حدث خطأ أثناء إنهاء الجولة");
    }
  };
  
  const handleAskQuestion = async (question: string, answer: 'yes' | 'no') => {
    if (!currentRound || !user) return;
    
    try {
      const result = await askQuestion(currentRound.id, user.id, question, answer);
      if (result) {
        setQuestions(prev => [...prev, result]);
        
        // Add to chat
        const systemMessage: RoomMessage = {
          id: `question-${Date.now()}`,
          room_id: roomId || '',
          user_id: user.id,
          username: user.username || 'أنت',
          message: `سؤال: ${question} | الإجابة: ${answer === 'yes' ? 'نعم' : 'لا'}`,
          sent_at: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, systemMessage]);
      }
    } catch (error) {
      console.error("Error asking question:", error);
      toast.error("حدث خطأ أثناء طرح السؤال");
    }
  };
  
  const handleUseAIHint = async () => {
    if (!user || !currentRound || aiHelpsUsed >= 3) {
      if (aiHelpsUsed >= 3) {
        toast.error("لقد استنفدت جميع مساعدات الذكاء الاصطناعي المتاحة");
      }
      return;
    }
    
    try {
      toast.info('جاري استخدام الذكاء الاصطناعي للحصول على تلميح...');
      
      const success = await useAIHelp(user.id, currentRound.id);
      if (success) {
        setAiHelpsUsed(prev => prev + 1);
        
        // In a real app, this would call an AI API
        // For now we'll use a mock response
        setTimeout(() => {
          const hints = [
            'قد تكون الكلمة مرتبطة بالطعام!',
            'جرب السؤال عن ما إذا كان الشيء موجود في المنزل',
            'هل يمكن أن تكون شيئًا تستخدمه يوميًا؟',
            'فكر في الأشياء التي تراها في الطبيعة'
          ];
          
          const randomHint = hints[Math.floor(Math.random() * hints.length)];
          toast.success(`تلميح: ${randomHint}`);
        }, 1500);
      } else {
        toast.error("تعذر استخدام مساعدة الذكاء الاصطناعي");
      }
    } catch (error) {
      console.error("Error using AI hint:", error);
      toast.error("حدث خطأ أثناء طلب تلميح من الذكاء الاصطناعي");
    }
  };

  const handleLeaveRoom = () => {
    navigate('/dashboard');
    toast.info('لقد غادرت الغرفة');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Game Info */}
          <div className="md:col-span-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold text-white flex items-center">
                <Flame className="mr-2 h-6 w-6 text-orange-500" />
                غرفة: {roomId}
              </h1>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                {isHost && !gameStarted && (
                  <Button 
                    onClick={handleStartGame}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white"
                  >
                    بدء الجولة
                    <Crown className="mr-2 h-4 w-4" />
                  </Button>
                )}
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      مغادرة الغرفة
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-black/80 border border-red-900/50">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">تأكيد المغادرة</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        هل أنت متأكد من رغبتك في مغادرة الغرفة؟
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent text-gray-300 hover:bg-gray-800">إلغاء</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLeaveRoom} className="bg-red-600 hover:bg-red-700">مغادرة</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            {gameStarted && (
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
                        onChange={(e) => setSecretWord(e.target.value)}
                        className="bg-black/50 border-gray-700 text-white"
                        placeholder="أدخل الكلمة السرية هنا"
                      />
                      <Button 
                        onClick={handleSetSecretWord}
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
            )}
          </div>
          
          {/* Players List */}
          <div className="md:col-span-1">
            <Card className="h-full backdrop-blur-sm bg-black/20 border-gray-800">
              <CardHeader className="py-3 border-b border-gray-800">
                <CardTitle className="text-sm text-white flex items-center">
                  <Users className="mr-2 h-4 w-4 text-blue-500" />
                  اللاعبون ({players.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul>
                  {players.map(player => (
                    <li 
                      key={player.id} 
                      className="flex items-center justify-between px-4 py-3 border-b border-gray-800 last:border-0"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                          {player.username?.charAt(0) || '?'}
                        </div>
                        <span className="mr-2 text-gray-300">
                          {player.username || 'لاعب'}
                          {player.user_id === currentRound?.setter_id && (
                            <Crown className="inline mr-1 h-3.5 w-3.5 text-yellow-500" />
                          )}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Chat Area */}
          <div className="md:col-span-3">
            <Card className="h-full backdrop-blur-sm bg-black/20 border-gray-800 flex flex-col">
              <CardHeader className="py-3 border-b border-gray-800">
                <CardTitle className="text-sm text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4 text-green-500" />
                    المحادثة
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={aiHelpsUsed >= 3 || !gameStarted}
                    className={`h-8 border-gray-700 text-gray-300 hover:bg-gray-800 ${
                      aiHelpsUsed >= 3 || !gameStarted ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleUseAIHint}
                  >
                    <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                    استخدم تلميح الذكاء الاصطناعي ({3 - aiHelpsUsed})
                  </Button>
                </CardTitle>
              </CardHeader>
              
              <CardContent 
                className="flex-1 overflow-y-auto p-4 space-y-3" 
                style={{ maxHeight: "calc(70vh - 200px)" }}
                ref={chatContainerRef}
              >
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.user_id === user?.id 
                        ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-900/30' 
                        : msg.user_id === 'system'
                          ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-900/50'
                          : 'bg-gray-800/50 border border-gray-700/30'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">
                          {new Date(msg.sent_at).toLocaleTimeString('ar-EG', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <span className={`text-xs font-semibold ${
                          msg.user_id === user?.id 
                            ? 'text-purple-400' 
                            : msg.user_id === 'system'
                              ? 'text-orange-400'
                              : 'text-blue-400'
                        }`}>
                          {msg.username || 'لاعب'}
                        </span>
                      </div>
                      <p className="text-white text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>
              
              <div className="p-3 border-t border-gray-800">
                <div className="flex space-x-2 space-x-reverse">
                  <Input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="اكتب رسالتك هنا..."
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    className="bg-gradient-to-r from-purple-700 to-purple-900"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GameRoom;
