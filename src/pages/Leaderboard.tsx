
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import { Award, Trophy, Medal } from 'lucide-react';

// Mock leaderboard data
const leaderboardData = [
  { id: 'user1', username: 'احمد', points: 2500 },
  { id: 'user2', username: 'محمد', points: 1800 },
  { id: 'user3', username: 'سارة', points: 3200 },
  { id: 'user4', username: 'علي', points: 950 },
  { id: 'user5', username: 'فاطمة', points: 1650 },
  { id: 'user6', username: 'خالد', points: 2100 },
  { id: 'user7', username: 'ريم', points: 2800 },
  { id: 'user8', username: 'عمر', points: 1400 },
  { id: 'user9', username: 'منى', points: 1750 },
  { id: 'user10', username: 'يوسف', points: 2200 },
];

const Leaderboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Sort leaderboard by points (highest first)
  const sortedLeaderboard = [...leaderboardData].sort((a, b) => b.points - a.points);
  
  // Find current user's rank
  const userRank = user ? sortedLeaderboard.findIndex(item => item.id === user.id) + 1 : 0;
  
  if (!user) return null;

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="text-center mb-8">
          <Award className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold">قائمة المتصدرين</h1>
          <p className="text-muted-foreground">
            تنافس مع اللاعبين الآخرين وارتق في القائمة
          </p>
        </div>
        
        {/* User rank card */}
        <div className="glass-card p-4 mb-8 animate-scale-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <span className="font-bold">{userRank}</span>
              </div>
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-xs text-muted-foreground">ترتيبك الحالي</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">النقاط</p>
              <p className="font-bold">{user.points}</p>
            </div>
          </div>
        </div>
        
        {/* Top 3 players */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {sortedLeaderboard.slice(0, 3).map((player, index) => (
            <TopPlayerCard 
              key={player.id}
              rank={index + 1}
              username={player.username}
              points={player.points}
              isCurrentUser={user && player.id === user.id}
            />
          ))}
        </div>
        
        {/* Rest of leaderboard */}
        <div className="glass-card overflow-hidden">
          <div className="bg-muted/30 p-3 text-sm font-medium border-b">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-2 text-center">الترتيب</div>
              <div className="col-span-7">اللاعب</div>
              <div className="col-span-3 text-left">النقاط</div>
            </div>
          </div>
          
          <div className="divide-y">
            {sortedLeaderboard.slice(3).map((player, index) => (
              <div 
                key={player.id}
                className={`p-3 ${player.id === user?.id ? 'bg-primary/5' : ''}`}
              >
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-2 text-center font-medium">
                    {index + 4}
                  </div>
                  <div className="col-span-7">
                    <span className="font-medium">{player.username}</span>
                    {player.id === user?.id && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded mr-2">
                        أنت
                      </span>
                    )}
                  </div>
                  <div className="col-span-3 text-left font-bold">
                    {player.points}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface TopPlayerCardProps {
  rank: number;
  username: string;
  points: number;
  isCurrentUser: boolean;
}

const TopPlayerCard: React.FC<TopPlayerCardProps> = ({ rank, username, points, isCurrentUser }) => {
  const renderIcon = () => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return null;
    }
  };
  
  const getBgColor = () => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-b from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/20';
      case 2:
        return 'bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800/30 dark:to-gray-700/20';
      case 3:
        return 'bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/20';
      default:
        return '';
    }
  };

  return (
    <div className={`glass-card overflow-hidden ${isCurrentUser ? 'border-primary' : ''}`}>
      <div className={`p-3 flex justify-center ${getBgColor()}`}>
        <div className="flex items-center">
          {renderIcon()}
          <span className="font-bold mr-1">#{rank}</span>
        </div>
      </div>
      <div className="p-4 text-center">
        <p className="font-bold truncate mb-1">
          {username}
          {isCurrentUser && ' (أنت)'}
        </p>
        <p className="text-sm text-muted-foreground">النقاط</p>
        <p className="font-bold text-lg">{points}</p>
      </div>
    </div>
  );
};

export default Leaderboard;
