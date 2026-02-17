import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function AdvancedChallenges({ driverEmail }) {
  const queryClient = useQueryClient();

  const { data: challenges = [] } = useQuery({
    queryKey: ['driverChallenges', driverEmail],
    queryFn: () => base44.entities.DriverChallenge.filter({ driver_email: driverEmail })
  });

  const claimMutation = useMutation({
    mutationFn: async (challenge) => {
      await base44.entities.DriverChallenge.update(challenge.id, { completed: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['driverChallenges']);
      toast.success('Reward claimed!');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Team Challenges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {challenges.filter(c => !c.completed).map(challenge => (
          <div key={challenge.id} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{challenge.challenge_name}</span>
              <Badge className={challenge.challenge_type === 'team' ? 'bg-blue-600' : 'bg-green-600'}>
                {challenge.challenge_type === 'team' && <Users className="w-3 h-3 mr-1" />}
                {challenge.challenge_type}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {challenge.current_value} / {challenge.target_value}
              </div>
              {challenge.current_value >= challenge.target_value && (
                <Button
                  size="sm"
                  onClick={() => claimMutation.mutate(challenge)}
                  disabled={claimMutation.isPending}
                >
                  Claim ${challenge.reward_amount}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}