
export interface Room {
  id: string;
  code: string;
  owner_id: string;
  is_active: boolean;
  created_at: string;
}

export interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  username?: string; // Join with users table
  avatar_url?: string; // Join with users table
  joined_at: string;
}

export interface RoomMessage {
  id: string;
  room_id: string;
  user_id: string;
  username?: string; // Join with users table
  message: string;
  sent_at: string;
}

export interface Round {
  id: string;
  room_id: string;
  word: string;
  setter_id: string;
  winner_id?: string;
  start_time: string;
  end_time?: string;
}

export interface RoundQuestion {
  id: string;
  round_id: string;
  user_id: string;
  question: string;
  answer: 'yes' | 'no';
  asked_at: string;
}

export interface AIUse {
  id: string;
  user_id: string;
  round_id: string;
  used_at: string;
}

export interface AIHint {
  hint: string;
  related_to_word: boolean;
  confidence_score: number;
}

export interface User {
  id: string;
  username: string;
  avatar_url?: string;
  total_points: number;
  created_at: string;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'win' | 'boost_purchase' | 'ai_use' | 'redeem' | 'gift';
  description?: string;
  created_at: string;
}
