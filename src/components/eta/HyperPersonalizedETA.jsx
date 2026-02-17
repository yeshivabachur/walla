import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HyperPersonalizedETA({ rideRequest, driverEmail }) {
  const [etaData, setEtaData] = useState(null);

  useEffect(() => {
    const calculateETA = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Calculate hyper-personalized ETA for ride.

Driver: ${driverEmail}
Route: ${rideRequest.pickup_location} to ${rideRequest.dropoff_location}
Standard ETA: 15 minutes
Current weather: Light rain
Time of day: ${new Date().toLocaleTimeString()}

Consider:
1. Driver's historical speed patterns
2. Driver's route preferences
3. Micro-weather conditions
4. Time-specific traffic patterns

Provide personalized ETA with breakdown of adjustments.`,
        response_json_schema: {
          type: 'object',
          properties: {
            standard_eta_minutes: { type: 'number' },
            personalized_eta_minutes: { type: 'number' },
            driver_behavior_adjustment: { type: 'number' },
            weather_adjustment: { type: 'number' },
            confidence_score: { type: 'number' }
          }
        }
      });

      setEtaData(result);

      await base44.entities.HyperPersonalizedETA.create({
        ride_request_id: rideRequest.id,
        driver_email: driverEmail,
        standard_eta_minutes: result.standard_eta_minutes,
        personalized_eta_minutes: result.personalized_eta_minutes,
        factors: {
          driver_behavior_adjustment: result.driver_behavior_adjustment,
          weather_adjustment: result.weather_adjustment
        },
        confidence_score: result.confidence_score
      });
    };

    calculateETA();
  }, [rideRequest, driverEmail]);

  if (!etaData) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-900">AI-Powered ETA</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">{etaData.personalized_eta_minutes} min</p>
              <p className="text-xs text-gray-500">{etaData.confidence_score}% confident</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}