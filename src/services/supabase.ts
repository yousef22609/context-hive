import { createClient } from '@supabase/supabase-js';
import { Room, RoomMember, RoomMessage, Round, RoundQuestion, AIUse, User, Friend, PointsTransaction } from '../types/room';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  username: string;
  points: number;
  cash_number: string;
  avatar?: string;
  last_played_quiz?: Record<string, string>;
  show_promotion?: boolean;
}

// Room related functions
export const createRoom = async (ownerId: string): Promise<{room: Room, code: string} | null> => {
  try {
    // Generate a random 6-character room code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { data, error } = await supabase
      .from('rooms')
      .insert({
        code,
        owner_id: ownerId,
        is_active: true
      })
      .select('*')
      .single();
      
    if (error) throw error;
    
    // Add the owner as a room member automatically
    await supabase
      .from('room_members')
      .insert({
        room_id: data.id,
        user_id: ownerId
      });
      
    return {
      room: data,
      code
    };
  } catch (error) {
    console.error('Error creating room:', error);
    return null;
  }
};

export const joinRoom = async (roomCode: string, userId: string): Promise<Room | null> => {
  try {
    // First find the room by code
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', roomCode)
      .eq('is_active', true)
      .single();
      
    if (roomError || !room) {
      console.error('Room not found or not active');
      return null;
    }
    
    // Check if user is already a member
    const { data: existingMember, error: memberError } = await supabase
      .from('room_members')
      .select('*')
      .eq('room_id', room.id)
      .eq('user_id', userId)
      .single();
      
    if (!existingMember && !memberError) {
      // Add user as room member
      await supabase
        .from('room_members')
        .insert({
          room_id: room.id,
          user_id: userId
        });
    }
    
    return room;
  } catch (error) {
    console.error('Error joining room:', error);
    return null;
  }
};

export const getRoomMembers = async (roomId: string): Promise<RoomMember[]> => {
  try {
    const { data, error } = await supabase
      .from('room_members')
      .select(`
        *,
        user:user_id (username, avatar_url)
      `)
      .eq('room_id', roomId)
      .order('joined_at', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map(member => ({
      id: member.id,
      room_id: member.room_id,
      user_id: member.user_id,
      username: member.user?.username,
      avatar_url: member.user?.avatar_url,
      joined_at: member.joined_at
    }));
  } catch (error) {
    console.error('Error getting room members:', error);
    return [];
  }
};

export const getRoomMessages = async (roomId: string): Promise<RoomMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('room_messages')
      .select(`
        *,
        user:user_id (username)
      `)
      .eq('room_id', roomId)
      .order('sent_at', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map(message => ({
      id: message.id,
      room_id: message.room_id,
      user_id: message.user_id,
      username: message.user?.username,
      message: message.message,
      sent_at: message.sent_at
    }));
  } catch (error) {
    console.error('Error getting room messages:', error);
    return [];
  }
};

export const sendRoomMessage = async (roomId: string, userId: string, message: string): Promise<RoomMessage | null> => {
  try {
    const { data, error } = await supabase
      .from('room_messages')
      .insert({
        room_id: roomId,
        user_id: userId,
        message
      })
      .select('*, user:user_id (username)')
      .single();
      
    if (error) throw error;
    
    return {
      id: data.id,
      room_id: data.room_id,
      user_id: data.user_id,
      username: data.user?.username,
      message: data.message,
      sent_at: data.sent_at
    };
  } catch (error) {
    console.error('Error sending room message:', error);
    return null;
  }
};

// Game related functions
export const startNewRound = async (roomId: string, setterId: string, word: string): Promise<Round | null> => {
  try {
    const { data, error } = await supabase
      .from('rounds')
      .insert({
        room_id: roomId,
        word,
        setter_id: setterId
      })
      .select('*')
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error starting new round:', error);
    return null;
  }
};

export const getCurrentRound = async (roomId: string): Promise<Round | null> => {
  try {
    const { data, error } = await supabase
      .from('rounds')
      .select('*')
      .eq('room_id', roomId)
      .is('end_time', null)
      .order('start_time', { ascending: false })
      .limit(1)
      .single();
      
    if (error) return null;
    return data;
  } catch (error) {
    console.error('Error getting current round:', error);
    return null;
  }
};

export const askQuestion = async (roundId: string, userId: string, question: string, answer: 'yes' | 'no'): Promise<RoundQuestion | null> => {
  try {
    const { data, error } = await supabase
      .from('round_questions')
      .insert({
        round_id: roundId,
        user_id: userId,
        question,
        answer
      })
      .select('*')
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error asking question:', error);
    return null;
  }
};

export const getRoundQuestions = async (roundId: string): Promise<RoundQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('round_questions')
      .select('*')
      .eq('round_id', roundId)
      .order('asked_at', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting round questions:', error);
    return [];
  }
};

export const endRound = async (roundId: string, winnerId?: string): Promise<Round | null> => {
  try {
    const { data, error } = await supabase
      .from('rounds')
      .update({
        end_time: new Date().toISOString(),
        winner_id: winnerId
      })
      .eq('id', roundId)
      .select('*')
      .single();
      
    if (error) throw error;
    
    // If there's a winner, add points
    if (winnerId) {
      await addPoints(winnerId, 500, 'win', 'فوز في جولة تخمين الكلمة');
    }
    
    return data;
  } catch (error) {
    console.error('Error ending round:', error);
    return null;
  }
};

export const useAIHelp = async (userId: string, roundId: string): Promise<boolean> => {
  try {
    // Check if user has already used 3 AI helps in this round
    const { count, error: countError } = await supabase
      .from('ai_uses')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('round_id', roundId);
      
    if (countError) throw countError;
    
    if (count && count >= 3) {
      return false; // User has already used 3 AI helps
    }
    
    // Record AI use
    const { error } = await supabase
      .from('ai_uses')
      .insert({
        user_id: userId,
        round_id: roundId
      });
      
    if (error) throw error;
    
    // Deduct points for AI use
    await addPoints(userId, -50, 'ai_use', 'استخدام مساعدة الذكاء الاصطناعي');
    
    return true;
  } catch (error) {
    console.error('Error using AI help:', error);
    return false;
  }
};

export const addPoints = async (
  userId: string, 
  amount: number, 
  type: 'win' | 'boost_purchase' | 'ai_use' | 'redeem' | 'gift' = 'win',
  description?: string
): Promise<boolean> => {
  try {
    // Add points transaction
    const { error: transactionError } = await supabase
      .from('points_transactions')
      .insert({
        user_id: userId,
        amount,
        type,
        description
      });
      
    if (transactionError) throw transactionError;
    
    // Update user's total points
    const { error: userError } = await supabase
      .from('users')
      .update({ total_points: amount }) // This will be replaced with a proper increment
      .eq('id', userId);
      
    if (userError) throw userError;
    
    return true;
  } catch (error) {
    console.error('Error adding points:', error);
    return false;
  }
};

// Realtime subscriptions
export const subscribeToRoomMessages = (roomId: string, callback: (message: RoomMessage) => void) => {
  const channel = supabase.channel(`room-${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'room_messages',
        filter: `room_id=eq.${roomId}`
      },
      async (payload) => {
        const { data: userData } = await supabase
          .from('users')
          .select('username')
          .eq('id', payload.new.user_id)
          .single();
          
        const message: RoomMessage = {
          id: payload.new.id,
          room_id: payload.new.room_id,
          user_id: payload.new.user_id,
          username: userData?.username,
          message: payload.new.message,
          sent_at: payload.new.sent_at
        };
        callback(message);
      }
    )
    .subscribe();
    
  return () => {
    channel.unsubscribe();
  };
};

export const subscribeToRoomMembers = (roomId: string, callback: (member: RoomMember, eventType: 'INSERT' | 'DELETE') => void) => {
  const channel = supabase.channel(`members-${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'room_members',
        filter: `room_id=eq.${roomId}`
      },
      async (payload) => {
        const { data: userData } = await supabase
          .from('users')
          .select('username, avatar_url')
          .eq('id', payload.new.user_id)
          .single();
          
        const member: RoomMember = {
          id: payload.new.id,
          room_id: payload.new.room_id,
          user_id: payload.new.user_id,
          username: userData?.username,
          avatar_url: userData?.avatar_url,
          joined_at: payload.new.joined_at
        };
        callback(member, 'INSERT');
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'room_members',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        // For DELETE events we need to ensure payload.old has all required properties
        const oldMember = payload.old as Partial<RoomMember>;
        const member: RoomMember = {
          id: oldMember.id || '',
          room_id: oldMember.room_id || '',
          user_id: oldMember.user_id || '',
          username: oldMember.username,
          avatar_url: oldMember.avatar_url,
          joined_at: oldMember.joined_at || new Date().toISOString()
        };
        callback(member, 'DELETE');
      }
    )
    .subscribe();
    
  return () => {
    channel.unsubscribe();
  };
};
