import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PassengerJourneyAnalytics({ userEmail }) {
  const [insights, setInsights] = useState(null);

  const { data: rides = [] } = useQuery({
    queryKey: ['userRides', userEmail],
    queryFn: () => base44.entities.RideRequest.filter({ 
      passenger_email: userEmail,
      status: 'completed'
    })
  });

  useEffect(() => {
    if (rides.length === 0) return;

    const analyzeJourney = async () => {
      const totalSpent = rides.reduce((sum, r) => sum + (r.estimated_price || 0), 0);
      const avgFrequency = rides.length > 1 ? 
        (new Date(rides[0].created_date) - new Date(rides[rides.length - 1].created_date)) / (1000 * 60 * 60 * 24 * rides.length) : 0;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze passenger journey data:
- Total rides: ${rides.length}
- Total spent: $${totalSpent.toFixed(2)}
- Average frequency: ${avgFrequency.toFixed(1)} days between rides
- First ride: ${rides[rides.length - 1]?.created_date}
- Last ride: ${rides[0]?.created_date}

Provide:
1. Journey stage (new/active/loyal/at_risk/churned)
2. Churn risk score (0-100)
3. Predicted next ride date
4. Lifetime value estimate
5. Key insights and recommendations`,
        response_json_schema: {
          type: 'object',
          properties: {
            journey_stage: { type: 'string' },
            churn_risk_score: { type: 'number' },
            predicted_next_ride: { type: 'string' },
            lifetime_value: { type: 'number' },
            insights: { type: 'string' }
          }
        }
      });

      setInsights(result);

      await base44.entities.PassengerJourney.create({
        user_email: userEmail,
        journey_stage: result.journey_stage,
        first_ride_date: rides[rides.length - 1]?.created_date,
        last_ride_date: rides[0]?.created_date,
        total_rides: rides.length,
        total_spent: totalSpent,
        avg_ride_frequency_days: avgFrequency,
        churn_risk_score: result.churn_risk_score,
        predicted_next_ride: result.predicted_next_ride,
        lifetime_value: result.lifetime_value
      });
    };

    analyzeJourney();
  }, [rides, userEmail]);

  if (!insights || rides.length < 3) return null;

  const stageColors = {
    new: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    loyal: 'bg-purple-100 text-purple-800',
    at_risk: 'bg-orange-100 text-orange-800',
    churned: 'bg-red-100 text-red-800'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Your Journey
            </span>
            <Badge className={stageColors[insights.journey_stage]}>
              {insights.journey_stage}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Next Ride</span>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {new Date(insights.predicted_next_ride).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Lifetime Value</span>
              </div>
              <p className="text-sm font-bold text-gray-900">
                ${insights.lifetime_value.toFixed(0)}
              </p>
            </div>
          </div>

          {insights.churn_risk_score > 50 && (
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <p className="text-xs font-semibold text-orange-800 mb-1">
                We miss you!
              </p>
              <p className="text-xs text-orange-700">
                Book a ride soon and get 15% off your next trip
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">AI Insights</p>
            <p className="text-xs text-gray-600">{insights.insights}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}