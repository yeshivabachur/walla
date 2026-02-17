import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerRetentionInsights({ userEmail }) {
  const [insights, setInsights] = useState(null);

  const { data: rides = [] } = useQuery({
    queryKey: ['customerRides', userEmail],
    queryFn: () => base44.entities.RideRequest.filter({
      passenger_email: userEmail,
      status: 'completed'
    })
  });

  useEffect(() => {
    if (rides.length < 3) return;

    const analyzeRetention = async () => {
      const lastRide = rides[0];
      const daysSinceLastRide = Math.floor(
        (new Date() - new Date(lastRide.created_date)) / (1000 * 60 * 60 * 24)
      );

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze customer retention and engagement.

Total rides: ${rides.length}
Days since last ride: ${daysSinceLastRide}

Provide:
1. Retention status (high/medium/low)
2. Engagement level (0-100)
3. Personalized retention offer
4. Next predicted booking date`,
        response_json_schema: {
          type: 'object',
          properties: {
            retention_status: { type: 'string' },
            engagement_score: { type: 'number' },
            offer: { type: 'string' },
            predicted_next_ride: { type: 'string' }
          }
        }
      });

      setInsights(result);
    };

    analyzeRetention();
  }, [rides]);

  if (!insights) return null;

  const statusColor = {
    high: 'bg-green-600',
    medium: 'bg-yellow-600',
    low: 'bg-red-600'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              Loyalty Status
            </span>
            <Badge className={`${statusColor[insights.retention_status]} text-white`}>
              {insights.retention_status.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-pink-600" />
              <p className="text-xs text-gray-600">Engagement Score</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{insights.engagement_score}%</p>
          </div>

          {insights.offer && (
            <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-pink-600" />
                <p className="text-xs font-semibold text-pink-800">Special Offer</p>
              </div>
              <p className="text-xs text-pink-900">{insights.offer}</p>
            </div>
          )}

          {insights.predicted_next_ride && (
            <p className="text-xs text-gray-600 text-center">
              Next ride predicted: {insights.predicted_next_ride}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}