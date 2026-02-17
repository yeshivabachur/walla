import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Brain, TrendingUp, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SmartETAPredictor({ pickup, dropoff, rideRequestId }) {
  const [eta, setEta] = useState(null);

  useEffect(() => {
    const predictETA = async () => {
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Predict accurate ETA for ride from ${pickup} to ${dropoff} at ${new Date().toLocaleString()}.

Consider:
- Current traffic patterns
- Weather conditions
- Time of day
- Historical data
- Road conditions
- Events nearby

Provide detailed prediction with confidence.`,
          response_json_schema: {
            type: 'object',
            properties: {
              eta_minutes: { type: 'number' },
              confidence: { type: 'number' },
              traffic_level: { type: 'string' },
              weather_impact: { type: 'string' },
              alternative_eta: { type: 'number' },
              recommendation: { type: 'string' }
            }
          }
        });

        setEta(result);

        if (rideRequestId) {
          await base44.entities.SmartETA.create({
            ride_request_id: rideRequestId,
            predicted_arrival: new Date(Date.now() + result.eta_minutes * 60000).toISOString(),
            confidence: result.confidence,
            factors: {
              traffic: result.traffic_level,
              weather: result.weather_impact
            },
            accuracy: result.confidence
          });
        }
      } catch (error) {
        console.error('ETA prediction failed:', error);
      }
    };

    if (pickup && dropoff) predictETA();
  }, [pickup, dropoff, rideRequestId]);

  if (!eta) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Smart ETA</span>
            </div>
            <Badge className="bg-blue-600 text-white">
              {Math.round(eta.confidence * 100)}% confidence
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-600">Predicted</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{eta.eta_minutes} min</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-600">Alternative</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{eta.alternative_eta} min</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between bg-white rounded-lg p-2">
              <span className="text-gray-600">Traffic</span>
              <span className="font-semibold text-gray-900">{eta.traffic_level}</span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-2">
              <span className="text-gray-600">Weather</span>
              <span className="font-semibold text-gray-900">{eta.weather_impact}</span>
            </div>
          </div>

          {eta.recommendation && (
            <div className="mt-3 bg-blue-100 rounded-lg p-2">
              <p className="text-xs text-blue-800">
                💡 {eta.recommendation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}