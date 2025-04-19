
export interface Room {
  id: string;
  name: string;
  host_id: string;
  max_players: number;
  current_round: number;
  total_rounds: number;
  status: 'waiting' | 'playing' | 'finished';
  created_at: string;
  secret_word?: string;
  current_player_id?: string;
  round_end_time?: string;
}

export interface RoomPlayer {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  points: number;
  joined_at: string;
  is_host: boolean;
  is_current_player: boolean;
}

export interface RoomMessage {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  content: string;
  timestamp: string;
  is_system_message?: boolean;
}

export interface AIHint {
  hint: string;
  related_to_word: boolean;
  confidence_score: number;
}
