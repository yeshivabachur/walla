import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Gift } from 'lucide-react';
import { toast } from 'sonner';

export default function RideStreakRewards({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: rewards = [] } = useQuery({
    queryKey: ['streakRewards', userEmail],
    queryFn: () => base44.entities.RideStreakReward.filter({ user_email: userEmail, claimed: false })
  });

  const claimMutation = useMutation({
    mutationFn: async (reward) => {
      await base44.entities.RideStreakReward.update(reward.id, { claimed: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['streakRewards']);
      toast.success('Reward claimed! 🎉');
    }
  });

  if (rewards.length === 0) return null;

  return (
    <Card className="border-2 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Flame className="w-4 h-4 text-orange-600" />
          Streak Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rewards.map(reward => (
          <div key={reward.id} className="bg-white rounded-lg p-2 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{reward.streak_length} Day Streak!</p>
              <p className="text-xs text-gray-600">{reward.reward_type} reward</p>
            </div>
            <Button size="sm" onClick={() => claimMutation.mutate(reward)}>
              <Gift className="w-3 h-3 mr-1" />
              Claim
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}