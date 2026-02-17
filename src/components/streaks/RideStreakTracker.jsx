import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const streakRewards = [
  { days: 7, reward: '5% off next ride', icon: '🎯' },
  { days: 14, reward: '$10 credit', icon: '💰' },
  { days: 30, reward: 'Free ride up to $20', icon: '🎁' },
  { days: 60, reward: 'VIP status upgrade', icon: '👑' },
  { days: 100, reward: 'Lifetime 10% discount', icon: '⭐' }
];

export default function RideStreakTracker({ userEmail }) {
  const { data: streak } = useQuery({
    queryKey: ['rideStreak', userEmail],
    queryFn: async () => {
      const streaks = await base44.entities.RideStreak.filter({ user_email: userEmail });
      if (streaks[0]) return streaks[0];
      
      return await base44.entities.RideStreak.create({
        user_email: userEmail,
        current_streak: 0,
        longest_streak: 0,
        total_rides: 0
      });
    },
    enabled: !!userEmail
  });

  if (!streak || streak.current_streak === 0) return null;

  const nextReward = streakRewards.find(r => r.days > streak.current_streak);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              Ride Streak
            </span>
            <Badge className="bg-orange-600 text-white text-xl px-3 py-1">
              {streak.current_streak} 🔥
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-3 text-center">
              <Calendar className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-orange-600">{streak.current_streak}</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <Trophy className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Best Streak</p>
              <p className="text-2xl font-bold text-yellow-600">{streak.longest_streak}</p>
            </div>
          </div>

          {nextReward && (
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">Next Reward</span>
                <span className="text-2xl">{nextReward.icon}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{nextReward.reward}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all"
                  style={{ width: `${(streak.current_streak / nextReward.days) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {nextReward.days - streak.current_streak} days to go
              </p>
            </div>
          )}

          <p className="text-xs text-center text-gray-500">
            Keep riding daily to maintain your streak! 🚀
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}