import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Crown, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GlobalLeaderboard({ userEmail }) {
  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      let items = await base44.entities.RideLeaderboard.list('-total_points', 10);
      
      if (items.length === 0) {
        const mockData = [
          { user_email: 'user1@example.com', username: 'SpeedRacer', total_points: 5420, total_rides: 142 },
          { user_email: 'user2@example.com', username: 'EcoWarrior', total_points: 4890, total_rides: 128 },
          { user_email: 'user3@example.com', username: 'NightOwl', total_points: 4560, total_rides: 115 }
        ];
        
        await Promise.all(mockData.map((data, idx) => 
          base44.entities.RideLeaderboard.create({ ...data, rank: idx + 1 })
        ));
        
        return mockData.map((d, idx) => ({ ...d, rank: idx + 1 }));
      }
      
      return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
    }
  });

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-gray-500 font-bold">#{rank}</span>;
  };

  if (isLoading) return null;

  return (
    <Card className="border-0 shadow-lg col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {leaderboard.slice(0, 5).map((entry, index) => (
          <motion.div
            key={entry.user_email}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center justify-between p-3 rounded-lg ${
              entry.user_email === userEmail 
                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300' 
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 flex items-center justify-center">
                {getRankIcon(entry.rank)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {entry.username}
                  {entry.user_email === userEmail && (
                    <Badge className="ml-2 bg-indigo-600 text-white text-xs">You</Badge>
                  )}
                </p>
                <p className="text-xs text-gray-600">{entry.total_rides} rides</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">{entry.total_points}</p>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}