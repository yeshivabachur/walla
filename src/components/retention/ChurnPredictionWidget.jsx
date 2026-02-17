import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from 'lucide-react';

export default function ChurnPredictionWidget({ userEmail }) {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const predictChurn = async () => {
      const rides = await base44.entities.RideRequest.filter({ passenger_email: userEmail });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Predict churn probability for user.

User: ${userEmail}
Total rides: ${rides.length}
Last ride: ${rides[0]?.created_date || 'Never'}

Analyze and provide churn prediction with retention recommendations.`,
        response_json_schema: {
          type: 'object',
          properties: {
            churn_probability: { type: 'number' },
            risk_level: { type: 'string' },
            contributing_factors: { type: 'array', items: { type: 'string' } },
            recommended_actions: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setPrediction(result);

      await base44.entities.ChurnPrediction.create({
        user_email: userEmail,
        churn_probability: result.churn_probability,
        risk_level: result.risk_level,
        contributing_factors: result.contributing_factors,
        recommended_actions: result.recommended_actions,
        last_ride_date: rides[0]?.created_date?.split('T')[0]
      });
    };

    predictChurn();
  }, [userEmail]);

  if (!prediction || prediction.risk_level === 'low') return null;

  return (
    <Card className="border-2 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-orange-600" />
          Retention Alert
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Badge className="bg-orange-600 text-white">
          {prediction.churn_probability}% churn risk
        </Badge>
        {prediction.recommended_actions?.map((action, idx) => (
          <p key={idx} className="text-sm text-orange-800">• {action}</p>
        ))}
      </CardContent>
    </Card>
  );
}