import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, TrendingUp } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export default function PassengerSafetyCard({ userEmail }) {
  const { data: safetyScore } = useQuery({
    queryKey: ['safetyScore', userEmail],
    queryFn: async () => {
      let scores = await base44.entities.PassengerSafetyScore.filter({ user_email: userEmail });
      if (scores.length === 0) {
        return await base44.entities.PassengerSafetyScore.create({
          user_email: userEmail,
          safety_score: 100,
          total_rides: 0,
          positive_reviews: 0,
          safety_badges: ['verified']
        });
      }
      return scores[0];
    },
    enabled: !!userEmail
  });

  if (!safetyScore) return null;

  return (
    <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Safety Score
          </span>
          <Badge className="bg-green-600 text-white text-lg px-3">
            {safetyScore.safety_score}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={safetyScore.safety_score} className="h-2" />
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white rounded-lg p-2">
            <p className="text-gray-600">Total Rides</p>
            <p className="font-bold text-gray-900">{safetyScore.total_rides}</p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-gray-600">Incidents</p>
            <p className="font-bold text-gray-900">{safetyScore.incident_count}</p>
          </div>
        </div>

        {safetyScore.safety_badges?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {safetyScore.safety_badges.map((badge, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}