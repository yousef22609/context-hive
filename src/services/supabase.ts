import { createClient } from '@supabase/supabase-js';
import { Room, RoomMember, RoomMessage, Round, RoundQuestion, AIUse, User, Friend, PointsTransaction } from '../types/room';
import { toast } from 'sonner';
import { supabase as supabaseClient, isSupabaseAvailable } from '../lib/supabase';

export { supabaseClient as supabase };

export interface UserProfile {
  id: string;
  username: string;
  points: number;
  cash_number: string;
  avatar?: string;
  last_played_quiz?: Record<string, string>;
  show_promotion?: boolean;
}

// Mock functions for when Supabase is not configured
const mockPromise = <T>(data: T | null = null) => 
  Promise.resolve({ data, error: isSupabaseAvailable() ? null : new Error('Supabase not configured') });

// Room related functions
export const createRoom = async (ownerId: string): Promise<{room: Room, code: string} | null> => {
  if (!isSupabaseAvailable()) {
    toast.error('Supabase not configured. Using Firebase fallback.');
    return null;
  }
  
  try {
    // Generate a random 6-character room code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { data, error } = await supabaseClient
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
    await supabaseClient
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
  if (!isSupabaseAvailable()) {
    toast.error('Supabase not configured. Using Firebase fallback.');
    return null;
  }
  
  try {
    // First find the room by code
    const { data: room, error: roomError } = await supabaseClient
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
    const { data: existingMember, error: memberError } = await supabaseClient
      .from('room_members')
      .select('*')
      .eq('room_id', room.id)
      .eq('user_id', userId)
      .single();
      
    if (!existingMember && !memberError) {
      // Add user as room member
      await supabaseClient
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
  if (!isSupabaseAvailable()) {
    return [];
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('room_members')
      .select(`
        *,
        profiles:user_id (username, avatar_url)
      `)
      .eq('room_id', roomId)
      .order('joined_at', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map(member => ({
      id: member.id,
      room_id: member.room_id,
      user_id: member.user_id,
      username: member.profiles?.username,
      avatar_url: member.profiles?.avatar_url,
      joined_at: member.joined_at
    }));
  } catch (error) {
    console.error('Error getting room members:', error);
    return [];
  }
};

export const getRoomMessages = async (roomId: string): Promise<RoomMessage[]> => {
  if (!isSupabaseAvailable()) {
    return [];
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('room_messages')
      .select(`
        *,
        profiles:user_id (username)
      `)
      .eq('room_id', roomId)
      .order('sent_at', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map(message => ({
      id: message.id,
      room_id: message.room_id,
      user_id: message.user_id,
      username: message.profiles?.username,
      message: message.message,
      sent_at: message.sent_at
    }));
  } catch (error) {
    console.error('Error getting room messages:', error);
    return [];
  }
};

export const sendRoomMessage = async (roomId: string, userId: string, message: string): Promise<RoomMessage | null> => {
  if (!isSupabaseAvailable()) {
    toast.error('Supabase not configured. Using Firebase fallback.');
    return null;
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('room_messages')
      .insert({
        room_id: roomId,
        user_id: userId,
        message
      })
      .select(`*, profiles:user_id (username)`)
      .single();
      
    if (error) throw error;
    
    return {
      id: data.id,
      room_id: data.room_id,
      user_id: data.user_id,
      username: data.profiles?.username,
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
  if (!isSupabaseAvailable()) {
    toast.error('Supabase not configured. Using Firebase fallback.');
    return null;
  }
  
  try {
    const { data, error } = await supabaseClient
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
  if (!isSupabaseAvailable()) {
    return null;
  }
  
  try {
    const { data, error } = await supabaseClient
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
  if (!isSupabaseAvailable()) {
    toast.error('Supabase not configured. Using Firebase fallback.');
    return null;
  }
  
  try {
    const { data, error } = await supabaseClient
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
  if (!isSupabaseAvailable()) {
    return [];
  }
  
  try {
    const { data, error } = await supabaseClient
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
  if (!isSupabaseAvailable()) {
    toast.error('Supabase not configured. Using Firebase fallback.');
    return null;
  }
  
  try {
    const { data, error } = await supabaseClient
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
  if (!isSupabaseAvailable()) {
    toast.error('Supabase not configured. Using Firebase fallback.');
    return false;
  }
  
  try {
    // Check if user has already used 3 AI helps in this round
    const { data, error: countError } = await supabaseClient
      .from('ai_uses')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('round_id', roundId);
      
    if (countError) throw countError;
    
    const count = data?.length || 0;
    if (count >= 3) {
      return false; // User has already used 3 AI helps
    }
    
    // Record AI use
    const { error } = await supabaseClient
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
  if (!isSupabaseAvailable()) {
    toast.error('Supabase not configured. Using Firebase fallback.');
    return false;
  }
  
  try {
    // Add points transaction
    const { error: transactionError } = await supabaseClient
      .from('points_transactions')
      .insert({
        user_id: userId,
        amount,
        type,
        description
      });
      
    if (transactionError) throw transactionError;
    
    // Update user's total points
    const { error: userError } = await supabaseClient
      .from('profiles')
      .update({ total_points: supabaseClient.rpc('increment_points', { user_id: userId, points_to_add: amount }) })
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
  if (!isSupabaseAvailable() || !supabaseClient) {
    console.error("Supabase client not available for subscription");
    return () => {}; // Return empty unsubscribe function
  }
  
  console.log(`Subscribing to room messages for room ${roomId}`);
  
  const channel = supabaseClient
    .channel(`room_messages:${roomId}`)
    .on(
      'postgres_changes', 
      {
        event: 'INSERT',
        schema: 'public',
        table: 'room_messages',
        filter: `room_id=eq.${roomId}`
      },
      async (payload) => {
        console.log("Received message payload:", payload);
        
        try {
          // Fetch user details
          const { data: userData } = await supabaseClient
            .from('profiles')
            .select('username')
            .eq('id', payload.new.user_id)
            .single();
          
          const message: RoomMessage = {
            id: payload.new.id,
            room_id: payload.new.room_id,
            user_id: payload.new.user_id,
            username: userData?.username || 'مستخدم',
            message: payload.new.message,
            sent_at: payload.new.sent_at
          };
          
          console.log("Processed message:", message);
          callback(message);
        } catch (error) {
          console.error("Error processing message payload:", error);
        }
      }
    )
    .subscribe((status) => {
      console.log(`Room messages subscription status: ${status}`);
      if (status === 'SUBSCRIBED') {
        console.log(`Successfully subscribed to room_messages:${roomId}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`Error subscribing to room_messages:${roomId}`);
        toast.error("حدث خطأ في الاتصال بالغرفة، جاري إعادة الاتصال...");
      }
    });
    
  return () => {
    console.log(`Unsubscribing from room_messages:${roomId}`);
    supabaseClient.removeChannel(channel);
  };
};

export const subscribeToRoomMembers = (roomId: string, callback: (member: RoomMember, eventType: 'INSERT' | 'DELETE') => void) => {
  if (!isSupabaseAvailable() || !supabaseClient) {
    console.error("Supabase client not available for subscription");
    return () => {}; // Return empty unsubscribe function
  }
  
  console.log(`Subscribing to room members for room ${roomId}`);
  
  const channel = supabaseClient
    .channel(`room_members:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'room_members',
        filter: `room_id=eq.${roomId}`
      },
      async (payload) => {
        console.log("New member joined:", payload);
        
        try {
          // Fetch user details
          const { data: userData } = await supabaseClient
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', payload.new.user_id)
            .single();
          
          const member: RoomMember = {
            id: payload.new.id,
            room_id: payload.new.room_id,
            user_id: payload.new.user_id,
            username: userData?.username || 'لاعب جديد',
            avatar_url: userData?.avatar_url,
            joined_at: payload.new.joined_at
          };
          
          console.log("Processed member join:", member);
          callback(member, 'INSERT');
        } catch (error) {
          console.error("Error processing member join:", error);
        }
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
      async (payload) => {
        console.log("Member left:", payload);
        
        // For DELETE events we need to ensure payload.old has all required properties
        const oldMember = payload.old as Partial<RoomMember>;
        
        try {
          // Try to fetch username if possible
          let username = oldMember.username;
          if (!username && oldMember.user_id) {
            const { data: userData } = await supabaseClient
              .from('profiles')
              .select('username')
              .eq('id', oldMember.user_id)
              .single();
            username = userData?.username;
          }
          
          const member: RoomMember = {
            id: oldMember.id || '',
            room_id: oldMember.room_id || '',
            user_id: oldMember.user_id || '',
            username: username || 'لاعب',
            avatar_url: oldMember.avatar_url,
            joined_at: oldMember.joined_at || new Date().toISOString()
          };
          
          console.log("Processed member leave:", member);
          callback(member, 'DELETE');
        } catch (error) {
          console.error("Error processing member leave:", error);
        }
      }
    )
    .subscribe((status) => {
      console.log(`Room members subscription status: ${status}`);
      if (status === 'SUBSCRIBED') {
        console.log(`Successfully subscribed to room_members:${roomId}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`Error subscribing to room_members:${roomId}`);
        toast.error("حدث خطأ في الاتصال بقائمة اللاعبين، جاري إعادة الاتصال...");
      }
    });
  
  return () => {
    console.log(`Unsubscribing from room_members:${roomId}`);
    supabaseClient.removeChannel(channel);
  };
};

