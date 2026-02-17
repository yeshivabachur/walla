import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target } from 'lucide-react';

export default function RideChallengesCard({ userEmail }) {
  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges', userEmail],
    queryFn: async () => {
      const active = await base44.entities.RideChallenge.filter({
        end_date: { $gte: new Date().toISOString().split('T')[0] }
      });
      return active.slice(0, 3);
    }
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['challengeProgress', userEmail],
    queryFn: () => base44.entities.UserChallengeProgress.filter({ user_email: userEmail })
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Trophy className="w-4 h-4 text-yellow-600" />
          Active Challenges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {challenges.map(challenge => {
          const userProgress = progress.find(p => p.challenge_id === challenge.id);
          const percent = userProgress ? (userProgress.current_progress / challenge.target * 100) : 0;
          
          return (
            <div key={challenge.id} className="bg-gray-50 rounded p-2">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-semibold">{challenge.challenge_name}</p>
                <Badge className="bg-yellow-600">{challenge.reward_points} pts</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{width: `${percent}%`}}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {userProgress?.current_progress || 0} / {challenge.target}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}