
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Timer, Users, MessageSquare, Lightbulb, Flame, Crown, ArrowRight, Send } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for demonstrating UI
const mockPlayers = [
  { id: '1', username: 'لاعب 1', points: 1200, isHost: true },
  { id: '2', username: 'لاعب 2', points: 850, isHost: false },
  { id: '3', username: 'لاعب 3', points: 920, isHost: false },
];

const mockMessages = [
  { id: '1', sender: 'لاعب 1', content: 'مرحبًا بالجميع في الغرفة!', timestamp: '12:01' },
  { id: '2', sender: 'لاعب 2', content: 'هل نبدأ اللعبة؟', timestamp: '12:02' },
  { id: '3', sender: 'لاعب 3', content: 'نعم، أنا جاهز!', timestamp: '12:03' },
];

const GameRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [players, setPlayers] = useState(mockPlayers);
  const [gameStarted, setGameStarted] = useState(false);
  const [roundTime, setRoundTime] = useState(60);
  const [secretWord, setSecretWord] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState('');
  
  // Simulate a player is host based on first player in array
  const isHost = players[0]?.id === '1'; // In real app, compare to user.id
  
  // Effect for countdown timer when game is active
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameStarted && roundTime > 0) {
      timer = setInterval(() => {
        setRoundTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (roundTime === 0) {
      // Handle end of round
      toast.info('انتهى الوقت!');
      setGameStarted(false);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, roundTime]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: user?.username || 'أنت',
      content: message,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Check if message is a word guess in game mode
    if (gameStarted && secretWord && message.trim().toLowerCase() === secretWord.toLowerCase()) {
      toast.success('تهانينا! لقد خمنت الكلمة الصحيحة!');
      setGameStarted(false);
      // Here we would update points, etc.
    }
  };
  
  const handleStartGame = () => {
    if (players.length < 2) {
      toast.error('تحتاج إلى لاعبين على الأقل لبدء اللعبة');
      return;
    }
    
    // Select a random player to set the secret word
    const randomPlayerIndex = Math.floor(Math.random() * players.length);
    setCurrentPlayer(players[randomPlayerIndex].username);
    
    setSecretWord('');
    setRoundTime(60);
    setGameStarted(true);
    toast.success('تم بدء الجولة! انتظر حتى يختار اللاعب المختار الكلمة السرية');
  };
  
  const handleSetSecretWord = () => {
    if (!secretWord.trim()) {
      toast.error('الرجاء إدخال كلمة سرية');
      return;
    }
    
    toast.success('تم تعيين الكلمة السرية! بدأت الجولة');
    // In a real app, this would be sent to the server
  };
  
  const handleUseAIHint = () => {
    // This would call an AI API in a real implementation
    toast.info('جاري استخدام الذكاء الاصطناعي للحصول على تلميح...');
    
    setTimeout(() => {
      toast.success('تلميح: قد تكون الكلمة مرتبطة بالطعام!');
    }, 1500);
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
                        {currentPlayer === user?.username ? 'أنت تختار الكلمة السرية' : `الكلمة السرية يختارها: ${currentPlayer}`}
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
                
                {currentPlayer === user?.username && (
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
                          {player.username.charAt(0)}
                        </div>
                        <span className="mr-2 text-gray-300">
                          {player.username}
                          {player.isHost && (
                            <Crown className="inline mr-1 h-3.5 w-3.5 text-yellow-500" />
                          )}
                        </span>
                      </div>
                      <span className="text-sm text-orange-500">{player.points}</span>
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
                    className="h-8 border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={handleUseAIHint}
                  >
                    <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                    استخدم تلميح الذكاء الاصطناعي
                  </Button>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "calc(70vh - 200px)" }}>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === user?.username || msg.sender === 'أنت' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.sender === user?.username || msg.sender === 'أنت' 
                        ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-900/30' 
                        : 'bg-gray-800/50 border border-gray-700/30'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">{msg.timestamp}</span>
                        <span className={`text-xs font-semibold ${
                          msg.sender === user?.username || msg.sender === 'أنت' ? 'text-purple-400' : 'text-blue-400'
                        }`}>
                          {msg.sender}
                        </span>
                      </div>
                      <p className="text-white text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
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
