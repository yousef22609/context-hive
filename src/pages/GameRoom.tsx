
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { toast } from 'sonner';
import GameHeader from '@/components/game-room/GameHeader';
import PlayersList from '@/components/game-room/PlayersList';
import ChatMessages from '@/components/game-room/ChatMessages';
import GameStatus from '@/components/game-room/GameStatus';
import { 
  getRoomMembers, getRoomMessages, sendRoomMessage, 
  subscribeToRoomMembers, subscribeToRoomMessages,
  getCurrentRound, startNewRound, endRound,
  askQuestion, getRoundQuestions, useAIHelp
} from '../services/supabase';
import { RoomMember, RoomMessage, Round } from '../types/room';

const GameRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useUser();
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [players, setPlayers] = useState<RoomMember[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [roundTime, setRoundTime] = useState(60);
  const [secretWord, setSecretWord] = useState('');
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [questions, setQuestions] = useState<RoundQuestion[]>([]);
  const [aiHelpsUsed, setAiHelpsUsed] = useState(0);
  
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
        const roomMembers = await getRoomMembers(roomId);
        setPlayers(roomMembers);
        
        const roomMessages = await getRoomMessages(roomId);
        setMessages(roomMessages);
        
        const round = await getCurrentRound(roomId);
        if (round) {
          setCurrentRound(round);
          setGameStarted(true);
          
          if (round.setter_id === user.id) {
            setSecretWord(round.word);
          }
          
          const roundQuestions = await getRoundQuestions(round.id);
          setQuestions(roundQuestions);
          
          const startTime = new Date(round.start_time).getTime();
          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
          const remainingSeconds = Math.max(0, 60 - elapsedSeconds);
          setRoundTime(remainingSeconds);
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
    
    const unsubscribeMessages = subscribeToRoomMessages(roomId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });
    
    const unsubscribeMembers = subscribeToRoomMembers(roomId, (member, eventType) => {
      if (eventType === 'INSERT') {
        setPlayers(prev => {
          const playerExists = prev.some(p => p.user_id === member.user_id);
          if (playerExists) return prev;
          return [...prev, member];
        });
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

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !roomId) return;
    
    try {
      await sendRoomMessage(roomId, user.id, message);
      setMessage('');
      
      if (gameStarted && currentRound && message.trim().toLowerCase() === currentRound.word.toLowerCase() &&
          user.id !== currentRound.setter_id) {
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
    
    const eligiblePlayers = players.filter(p => p.user_id !== user?.id);
    const randomPlayerIndex = Math.floor(Math.random() * eligiblePlayers.length);
    const selectedPlayer = eligiblePlayers[randomPlayerIndex];
    
    try {
      const round = await startNewRound(roomId || '', selectedPlayer.user_id, "كلمة_مؤقتة");
      
      if (round) {
        setCurrentRound(round);
        setSecretWord('');
        setRoundTime(60);
        setGameStarted(true);
        setQuestions([]);
        
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
      const updatedRound = await startNewRound(roomId, currentRound.setter_id, secretWord);
      
      if (updatedRound) {
        setCurrentRound(updatedRound);
        toast.success('تم تعيين الكلمة السرية! بدأت الجولة');
        
        const systemMessage: RoomMessage = {
          id: `system-${Date.now()}`,
          room_id: roomId,
          user_id: 'system',
          username: 'النظام',
          message: 'تم تعيين الكلمة السرية! ابدأوا بطرح الأسئلة',
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
      
      setRoundTime(0);
      setSecretWord('');
      setQuestions([]);
    } catch (error) {
      console.error("Error ending round:", error);
      toast.error("حدث خطأ أثناء إنهاء الجولة");
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

  return (
    <Layout>
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-4">
            <GameHeader 
              roomId={roomId || ''}
              isHost={isHost}
              gameStarted={gameStarted}
              playersCount={players.length}
              onStartGame={handleStartGame}
            />
            
            <GameStatus 
              gameStarted={gameStarted}
              isCurrentPlayer={isCurrentPlayer}
              currentPlayerName={currentPlayerName}
              roundTime={roundTime}
              secretWord={secretWord}
              onSecretWordChange={setSecretWord}
              onConfirmWord={handleSetSecretWord}
            />
          </div>
          
          <div className="md:col-span-1">
            <PlayersList 
              players={players}
              currentSetterId={currentRound?.setter_id}
            />
          </div>
          
          <div className="md:col-span-3">
            <ChatMessages 
              messages={messages}
              currentUserId={user?.id}
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
              onUseAIHint={handleUseAIHint}
              aiHelpsRemaining={3 - aiHelpsUsed}
              gameStarted={gameStarted}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GameRoom;
