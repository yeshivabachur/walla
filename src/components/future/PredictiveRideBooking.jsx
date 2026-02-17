import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PredictiveRideBooking({ userEmail }) {
  const navigate = useNavigate();

  const { data: prediction } = useQuery({
    queryKey: ['predictiveBehavior', userEmail],
    queryFn: async () => {
      const predictions = await base44.entities.PredictiveBehavior.filter({ user_email: userEmail });
      return predictions[0];
    },
    enabled: !!userEmail
  });

  if (!prediction?.next_predicted_ride || prediction.prediction_accuracy < 70) return null;

  return (
    <Card className="border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          AI Predicts Your Next Ride
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-white rounded-xl p-3">
          <p className="text-sm font-semibold text-gray-900">
            📍 {prediction.next_predicted_ride.destination}
          </p>
          <p className="text-xs text-gray-600">
            🕐 Around {prediction.next_predicted_ride.time}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-indigo-700 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {prediction.next_predicted_ride.confidence}% confidence
          </span>
          <Button
            size="sm"
            onClick={() => navigate(createPageUrl('RequestRide'))}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}