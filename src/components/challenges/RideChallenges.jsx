import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Flame, Award, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const challenges = [
  {
    id: 'daily_rider',
    name: 'Daily Commute',
    description: 'Complete 2 rides today',
    type: 'daily',
    target: 2,
    points: 50,
    icon: '🚗'
  },
  {
    id: 'eco_week',
    name: 'Eco Week',
    description: 'Use eco vehicles 5 times this week',
    type: 'weekly',
    target: 5,
    points: 200,
    icon: '🌱'
  },
  {
    id: 'night_rider',
    name: 'Night Rider',
    description: 'Take 3 rides after 9 PM',
    type: 'weekly',
    target: 3,
    points: 150,
    icon: '🌙'
  },
  {
    id: 'social_sharer',
    name: 'Social Butterfly',
    description: 'Share 5 rides with friends',
    type: 'weekly',
    target: 5,
    points: 100,
    icon: '🦋'
  },
  {
    id: 'monthly_champion',
    name: 'Monthly Champion',
    description: 'Complete 30 rides this month',
    type: 'monthly',
    target: 30,
    points: 500,
    icon: '👑'
  }
];

export default function RideChallenges({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: userChallenges = [] } = useQuery({
    queryKey: ['challenges', userEmail],
    queryFn: async () => {
      let items = await base44.entities.RideChallenge.filter({ user_email: userEmail });
      
      if (items.length === 0) {
        const now = new Date();
        const created = await Promise.all(
          challenges.map(ch => {
            let expiresAt = new Date();
            if (ch.type === 'daily') expiresAt.setHours(23, 59, 59);
            else if (ch.type === 'weekly') expiresAt.setDate(now.getDate() + 7);
            else expiresAt.setMonth(now.getMonth() + 1);
            
            return base44.entities.RideChallenge.create({
              user_email: userEmail,
              challenge_id: ch.id,
              name: ch.name,
              description: ch.description,
              type: ch.type,
              target: ch.target,
              reward_points: ch.points,
              progress: 0,
              completed: false,
              expires_at: expiresAt.toISOString()
            });
          })
        );
        return created;
      }
      
      return items;
    },
    enabled: !!userEmail
  });

  const claimMutation = useMutation({
    mutationFn: async (challenge) => {
      await base44.entities.RideChallenge.update(challenge.id, { completed: true });
      
      const loyalty = await base44.entities.LoyaltyTier.filter({ user_email: userEmail });
      if (loyalty.length > 0) {
        await base44.entities.LoyaltyTier.update(loyalty[0].id, {
          total_rides: loyalty[0].total_rides + 1
        });
      }
    },
    onSuccess: () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success('🎉 Challenge completed! Points claimed!');
      queryClient.invalidateQueries(['challenges']);
    }
  });

  const active = userChallenges.filter(c => !c.completed);
  const completed = userChallenges.filter(c => c.completed);

  return (
    <Card className="border-0 shadow-lg mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600" />
            Active Challenges
          </span>
          <Badge className="bg-orange-600 text-white">
            {active.length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {active.map((challenge, index) => {
            const config = challenges.find(c => c.id === challenge.challenge_id);
            const isComplete = challenge.progress >= challenge.target;
            const progressPercent = (challenge.progress / challenge.target) * 100;
            
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl p-4 border-2 ${
                  isComplete 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{config?.icon}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{challenge.name}</p>
                      <p className="text-xs text-gray-600">{challenge.description}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {challenge.type}
                      </Badge>
                    </div>
                  </div>
                  {isComplete && !challenge.completed && (
                    <Button
                      size="sm"
                      onClick={() => claimMutation.mutate(challenge)}
                      disabled={claimMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Award className="w-3 h-3 mr-1" />
                      Claim
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Progress value={progressPercent} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {challenge.progress} / {challenge.target}
                    </span>
                    <Badge className="bg-orange-600 text-white">
                      +{challenge.reward_points} pts
                    </Badge>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {completed.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Completed ({completed.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {completed.map(ch => {
                const config = challenges.find(c => c.id === ch.challenge_id);
                return (
                  <Badge key={ch.id} className="bg-gray-100 text-gray-700">
                    {config?.icon} {ch.name}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}