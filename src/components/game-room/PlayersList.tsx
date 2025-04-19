
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Crown } from 'lucide-react';
import { RoomMember } from '@/types/room';

interface PlayersListProps {
  players: RoomMember[];
  currentSetterId?: string;
}

const PlayersList: React.FC<PlayersListProps> = ({ players, currentSetterId }) => {
  return (
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
                  {player.user_id === currentSetterId && (
                    <Crown className="inline mr-1 h-3.5 w-3.5 text-yellow-500" />
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PlayersList;
