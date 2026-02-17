import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const achievements = [
  { id: 'first_ride', name: 'First Ride', icon: '🚗', description: 'Complete your first ride', target: 1, points: 50 },
  { id: 'regular_rider', name: 'Regular Rider', icon: '⭐', description: 'Complete 10 rides', target: 10, points: 100 },
  { id: 'frequent_flyer', name: 'Frequent Flyer', icon: '✈️', description: 'Complete 50 rides', target: 50, points: 500 },
  { id: 'social_butterfly', name: 'Social Butterfly', icon: '🦋', description: 'Refer 5 friends', target: 5, points: 250 },
  { id: 'eco_warrior', name: 'Eco Warrior', icon: '🌱', description: 'Use eco vehicles 20 times', target: 20, points: 300 },
  { id: 'night_owl', name: 'Night Owl', icon: '🦉', description: 'Take 10 late night rides', target: 10, points: 150 },
  { id: 'explorer', name: 'Explorer', icon: '🗺️', description: 'Visit 15 different cities', target: 15, points: 400 }
];

export default function AchievementTracker({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: userAchievements = [], isLoading } = useQuery({
    queryKey: ['achievements', userEmail],
    queryFn: async () => {
      let items = await base44.entities.Achievement.filter({ user_email: userEmail });
      
      if (items.length === 0) {
        const created = await Promise.all(
          achievements.map(ach => 
            base44.entities.Achievement.create({
              user_email: userEmail,
              achievement_id: ach.id,
              name: ach.name,
              description: ach.description,
              icon: ach.icon,
              target: ach.target,
              points_reward: ach.points,
              progress: 0,
              unlocked: false
            })
          )
        );
        return created;
      }
      
      return items;
    },
    enabled: !!userEmail
  });

  const unlocked = userAchievements.filter(a => a.unlocked).length;
  const total = achievements.length;

  if (isLoading) return null;

  return (
    <Card className="border-0 shadow-lg mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Achievements
          </span>
          <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
            {unlocked}/{total}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {userAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl p-4 text-center ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300'
                  : 'bg-gray-100 border-2 border-gray-200'
              }`}
            >
              <div className={`text-4xl mb-2 ${!achievement.unlocked && 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              <p className="text-xs font-semibold text-gray-900">{achievement.name}</p>
              {!achievement.unlocked && (
                <div className="mt-2">
                  <Progress value={(achievement.progress / achievement.target) * 100} className="h-1" />
                  <p className="text-xs text-gray-600 mt-1">
                    {achievement.progress}/{achievement.target}
                  </p>
                </div>
              )}
              {achievement.unlocked && (
                <Badge className="mt-2 bg-yellow-600 text-white text-xs">
                  +{achievement.points_reward} pts
                </Badge>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}