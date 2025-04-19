
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Lightbulb, Send } from 'lucide-react';
import { RoomMessage } from '@/types/room';

interface ChatMessagesProps {
  messages: RoomMessage[];
  currentUserId?: string;
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onUseAIHint: () => void;
  aiHelpsRemaining: number;
  gameStarted: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentUserId,
  message,
  onMessageChange,
  onSendMessage,
  onUseAIHint,
  aiHelpsRemaining,
  gameStarted
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
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
            disabled={aiHelpsRemaining <= 0 || !gameStarted}
            className={`h-8 border-gray-700 text-gray-300 hover:bg-gray-800 ${
              aiHelpsRemaining <= 0 || !gameStarted ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={onUseAIHint}
          >
            <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
            استخدم تلميح الذكاء الاصطناعي ({aiHelpsRemaining})
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
            className={`flex ${msg.user_id === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.user_id === currentUserId 
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
                  msg.user_id === currentUserId 
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
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="اكتب رسالتك هنا..."
            className="bg-gray-900 border-gray-700 text-white"
          />
          <Button 
            onClick={onSendMessage} 
            className="bg-gradient-to-r from-purple-700 to-purple-900"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatMessages;
