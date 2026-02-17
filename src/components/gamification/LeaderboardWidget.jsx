import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal, TrendingUp } from 'lucide-react';

export default function LeaderboardWidget({ userEmail }) {
  const { data: leaderboard = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const all = await base44.entities.GameLeaderboard.list('-total_points', 10);
      return all;
    }
  });

  const userRank = leaderboard.findIndex(l => l.user_email === userEmail) + 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Medal className="w-4 h-4 text-yellow-600" />
          Top Riders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {leaderboard.slice(0, 5).map((entry, idx) => (
          <div key={entry.id} className={`flex justify-between items-center p-2 rounded ${
            entry.user_email === userEmail ? 'bg-blue-50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{idx + 1}</span>
              <span className="text-sm">{entry.user_email.split('@')[0]}</span>
            </div>
            <span className="font-semibold">{entry.total_points} pts</span>
          </div>
        ))}
        {userRank > 5 && (
          <div className="border-t pt-2 mt-2">
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              You're #{userRank}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}