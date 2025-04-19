
import { createClient } from '@supabase/supabase-js';
import { Room, RoomMember, RoomMessage, Round, RoundQuestion, AIUse, User, Friend, PointsTransaction } from '../types/room';

// Provide fallback values if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fallback-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZmFsbGJhY2t2YWx1ZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE5NTczMjkyMDB9.dummy_key_for_development';

// Check if keys are invalid
const useRealSupabase = supabaseUrl.includes('.supabase.co') && 
                         supabaseUrl !== 'https://fallback-project.supabase.co' && 
                         supabaseAnonKey.length > 20 &&
                         !supabaseAnonKey.includes('dummy_key_for_development');

// Create a mock Supabase client if real credentials are missing
export const supabase = useRealSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ 
          data: { 
            subscription: { 
              unsubscribe: () => {} 
            } 
          } 
        }),
        signOut: async () => {},
        signInWithPassword: async (credentials: {email: string, password: string}) => {
          console.log('Mock sign in attempt:', credentials.email);
          // Always return an error with the mock client
          return { 
            data: null, 
            error: { 
              message: 'تعذر تسجيل الدخول. الرجاء استخدام خيار "الدخول كزائر" أو قم بإعداد Supabase', 
              status: 400 
            } 
          };
        },
        signUp: async (credentials: {email: string, password: string}) => {
          console.log('Mock sign up attempt:', credentials.email);
          // Always return an error with the mock client
          return { 
            data: null, 
            error: { 
              message: 'تعذر إنشاء حساب. الرجاء استخدام خيار "الدخول كزائر" أو قم بإعداد Supabase', 
              status: 400 
            } 
          };
        }
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            data: [],
            error: null,
            count: 0
          }),
          data: [],
          error: null,
          count: 0
        }),
        insert: () => ({
          data: null,
          error: { message: 'Supabase not configured' }
        }),
        update: () => ({
          eq: () => ({
            data: null,
            error: { message: 'Supabase not configured' }
          })
        }),
        delete: () => ({
          eq: () => ({
            data: null, 
            error: { message: 'Supabase not configured' }
          })
        })
      }),
      channel: (name: string) => ({
        on: () => ({
          subscribe: () => {}
        })
      })
    };

// Show a warning if not using real Supabase
if (!useRealSupabase) {
  console.warn('Using mock Supabase client. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file for real functionality.');
}

export interface UserProfile {
  id: string;
  username: string;
  points: number;
  cash_number: string;
  avatar?: string;
  last_played_quiz?: Record<string, string>;
  show_promotion?: boolean;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // If using mock Supabase, return test profile
    if (!useRealSupabase) {
      return {
        id: userId,
        username: 'زائر_تجريبي',
        points: 150,
        cash_number: '',
        last_played_quiz: {},
        show_promotion: true
      };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    if (!useRealSupabase) {
      console.log('Mock update user profile:', updates);
      return true;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Room related functions
export const createRoom = async (ownerId: string): Promise<{room: Room, code: string} | null> => {
  try {
    // Generate a random 6-character room code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    if (!useRealSupabase) {
      console.log('Mock create room with code:', code);
      return {
        room: {
          id: Math.random().toString(36).substring(2, 15),
          code,
          owner_id: ownerId,
          is_active: true,
          created_at: new Date().toISOString()
        },
        code
      };
    }
    
    const { data, error } = await supabase
      .from('rooms')
      .insert({
        code,
        owner_id: ownerId,
        is_active: true
      })
      .select()
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
    if (!useRealSupabase) {
      console.log('Mock join room with code:', roomCode);
      return {
        id: Math.random().toString(36).substring(2, 15),
        code: roomCode,
        owner_id: 'mock-owner-id',
        is_active: true,
        created_at: new Date().toISOString()
      };
    }
    
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
      .select()
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
    if (!useRealSupabase) {
      console.log('Mock get room members for room:', roomId);
      return [
        {
          id: 'mock-member-1',
          room_id: roomId,
          user_id: 'mock-user-1',
          username: 'لاعب 1',
          avatar_url: '',
          joined_at: new Date().toISOString()
        },
        {
          id: 'mock-member-2',
          room_id: roomId,
          user_id: 'mock-user-2',
          username: 'لاعب 2',
          avatar_url: '',
          joined_at: new Date().toISOString()
        }
      ];
    }
    
    const { data, error } = await supabase
      .from('room_members')
      .select(`
        *,
        user:user_id (username, avatar_url)
      `)
      .eq('room_id', roomId);
    
    if (error) throw error;
    
    // Transform the data to match our RoomMember interface
    return data.map(member => ({
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
    if (!useRealSupabase) {
      console.log('Mock get room messages for room:', roomId);
      return [
        {
          id: 'mock-message-1',
          room_id: roomId,
          user_id: 'mock-user-1',
          username: 'لاعب 1',
          message: 'مرحباً بالجميع!',
          sent_at: new Date().toISOString()
        },
        {
          id: 'mock-message-2',
          room_id: roomId,
          user_id: 'mock-user-2',
          username: 'لاعب 2',
          message: 'هل نبدأ اللعبة؟',
          sent_at: new Date(Date.now() - 5000).toISOString()
        }
      ];
    }
    
    const { data, error } = await supabase
      .from('room_messages')
      .select(`
        *,
        user:user_id (username)
      `)
      .eq('room_id', roomId)
      .order('sent_at', { ascending: true });
    
    if (error) throw error;
    
    // Transform the data to match our RoomMessage interface
    return data.map(message => ({
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
    if (!useRealSupabase) {
      console.log('Mock send room message:', message);
      return {
        id: Math.random().toString(36).substring(2, 15),
        room_id: roomId,
        user_id: userId,
        message,
        sent_at: new Date().toISOString()
      };
    }
    
    const { data, error } = await supabase
      .from('room_messages')
      .insert({
        room_id: roomId,
        user_id: userId,
        message
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error sending room message:', error);
    return null;
  }
};

export const startNewRound = async (roomId: string, setterId: string, word: string): Promise<Round | null> => {
  try {
    if (!useRealSupabase) {
      console.log('Mock start new round with word:', word);
      return {
        id: Math.random().toString(36).substring(2, 15),
        room_id: roomId,
        word,
        setter_id: setterId,
        start_time: new Date().toISOString()
      };
    }
    
    const { data, error } = await supabase
      .from('rounds')
      .insert({
        room_id: roomId,
        word,
        setter_id: setterId
      })
      .select()
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
    if (!useRealSupabase) {
      return null; // Mock implementation could return a predefined round if needed
    }
    
    const { data, error } = await supabase
      .from('rounds')
      .select('*')
      .eq('room_id', roomId)
      .is('end_time', null) // Only get active rounds
      .order('start_time', { ascending: false })
      .limit(1)
      .single();
      
    if (error || !data) return null;
    
    return data;
  } catch (error) {
    console.error('Error getting current round:', error);
    return null;
  }
};

export const askQuestion = async (roundId: string, userId: string, question: string, answer: 'yes' | 'no'): Promise<RoundQuestion | null> => {
  try {
    if (!useRealSupabase) {
      console.log('Mock ask question:', question, 'Answer:', answer);
      return {
        id: Math.random().toString(36).substring(2, 15),
        round_id: roundId,
        user_id: userId,
        question,
        answer,
        asked_at: new Date().toISOString()
      };
    }
    
    const { data, error } = await supabase
      .from('round_questions')
      .insert({
        round_id: roundId,
        user_id: userId,
        question,
        answer
      })
      .select()
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
    if (!useRealSupabase) {
      return []; // Mock implementation could return predefined questions
    }
    
    const { data, error } = await supabase
      .from('round_questions')
      .select('*')
      .eq('round_id', roundId)
      .order('asked_at', { ascending: true });
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting round questions:', error);
    return [];
  }
};

export const endRound = async (roundId: string, winnerId?: string): Promise<Round | null> => {
  try {
    if (!useRealSupabase) {
      console.log('Mock end round, winner:', winnerId || 'none');
      return {
        id: roundId,
        room_id: 'mock-room-id',
        word: 'mock-word',
        setter_id: 'mock-setter-id',
        winner_id: winnerId,
        start_time: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
        end_time: new Date().toISOString()
      };
    }
    
    const { data, error } = await supabase
      .from('rounds')
      .update({
        end_time: new Date().toISOString(),
        winner_id: winnerId
      })
      .eq('id', roundId)
      .select()
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
    if (!useRealSupabase) {
      console.log('Mock use AI help');
      return true;
    }
    
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
    if (!useRealSupabase) {
      console.log(`Mock add ${amount} points to user ${userId}`);
      return true;
    }
    
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
      .update({
        total_points: supabase.rpc('increment', { x: amount })
      })
      .eq('id', userId);
      
    if (userError) throw userError;
    
    return true;
  } catch (error) {
    console.error('Error adding points:', error);
    return false;
  }
};

// Setup Realtime subscriptions for room messages
export const subscribeToRoomMessages = (roomId: string, callback: (message: RoomMessage) => void) => {
  if (!useRealSupabase) {
    console.log('Mock subscribe to room messages');
    return () => {};
  }
  
  const channel = supabase
    .channel(`room_messages:${roomId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'room_messages',
      filter: `room_id=eq.${roomId}`
    }, (payload) => {
      // Fetch the username
      supabase
        .from('users')
        .select('username')
        .eq('id', payload.new.user_id)
        .single()
        .then(({ data }) => {
          const message: RoomMessage = {
            ...payload.new,
            username: data?.username
          };
          callback(message);
        });
    })
    .subscribe();
    
  return () => {
    channel.unsubscribe();
  };
};

// Setup Realtime subscriptions for room members
export const subscribeToRoomMembers = (roomId: string, callback: (member: RoomMember, eventType: 'INSERT' | 'DELETE') => void) => {
  if (!useRealSupabase) {
    console.log('Mock subscribe to room members');
    return () => {};
  }
  
  const channel = supabase
    .channel(`room_members:${roomId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'room_members',
      filter: `room_id=eq.${roomId}`
    }, (payload) => {
      // Fetch the username and avatar
      supabase
        .from('users')
        .select('username, avatar_url')
        .eq('id', payload.new.user_id)
        .single()
        .then(({ data }) => {
          const member: RoomMember = {
            ...payload.new,
            username: data?.username,
            avatar_url: data?.avatar_url
          };
          callback(member, 'INSERT');
        });
    })
    .on('postgres_changes', {
      event: 'DELETE',
      schema: 'public',
      table: 'room_members',
      filter: `room_id=eq.${roomId}`
    }, (payload) => {
      callback(payload.old as RoomMember, 'DELETE');
    })
    .subscribe();
    
  return () => {
    channel.unsubscribe();
  };
};
