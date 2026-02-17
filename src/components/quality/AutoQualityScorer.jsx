import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from 'lucide-react';

export default function AutoQualityScorer({ rideRequestId, driverEmail }) {
  const [qualityScore, setQualityScore] = useState(null);

  useEffect(() => {
    const calculateQuality = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze ride quality for ride ${rideRequestId}.
        
        Calculate scores (0-100) for:
        - Route efficiency
        - Passenger comfort
        - Communication
        - Timeliness
        - Overall score
        
        Provide 2-3 AI insights for improvement.`,
        response_json_schema: {
          type: 'object',
          properties: {
            route_efficiency: { type: 'number' },
            passenger_comfort: { type: 'number' },
            communication_score: { type: 'number' },
            timeliness: { type: 'number' },
            overall_score: { type: 'number' },
            ai_insights: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      await base44.entities.RideQualityScore.create({
        ride_request_id: rideRequestId,
        driver_email: driverEmail,
        ...result
      });

      setQualityScore(result);
    };

    calculateQuality();
  }, [rideRequestId, driverEmail]);

  if (!qualityScore) return null;

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 text-green-600" />
          Ride Quality Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-center mb-3">
          <div className="text-3xl font-bold text-green-700">{qualityScore.overall_score}</div>
          <Progress value={qualityScore.overall_score} className="mt-2" />
        </div>
        <div className="space-y-1 text-xs">
          {qualityScore.ai_insights?.map((insight, idx) => (
            <p key={idx} className="text-gray-700">• {insight}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}