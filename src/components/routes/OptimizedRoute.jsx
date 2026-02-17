import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation2, Clock, TrendingDown, Zap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OptimizedRoute({ pickup, dropoff, scheduledDateTime }) {
  const [optimization, setOptimization] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!pickup || !dropoff) return;

    const optimizeRoute = async () => {
      setIsLoading(true);
      
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `You are a route optimization AI for a ride-hailing service.
          
Analyze the following route and provide optimization:
- Pickup: ${pickup.address || 'Location A'}
- Dropoff: ${dropoff.address || 'Location B'}
- Scheduled Time: ${scheduledDateTime || 'ASAP'}

Consider:
1. Current time: ${new Date().toLocaleString()}
2. Real-time traffic patterns and predicted congestion
3. Fastest route vs most fuel-efficient route
4. Predictive ETA based on conditions
5. Multi-stop opportunities nearby

Provide:
- Estimated travel time in minutes
- Optimal departure time if scheduled
- Traffic level (low/medium/high)
- Fuel efficiency tip
- Alternative route suggestion if beneficial
- Predictive arrival time
- Multi-stop suggestions if efficient`,
          response_json_schema: {
            type: 'object',
            properties: {
              estimated_time_minutes: { type: 'number' },
              optimal_departure_time: { type: 'string' },
              traffic_level: { type: 'string' },
              fuel_tip: { type: 'string' },
              time_saved_minutes: { type: 'number' },
              route_recommendation: { type: 'string' },
              predictive_eta: { type: 'string' },
              multi_stop_suggestion: { type: 'string' }
            }
          }
        });

        setOptimization(result);
      } catch (error) {
        console.error('Route optimization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    optimizeRoute();
  }, [pickup, dropoff, scheduledDateTime]);

  if (isLoading) {
    return (
      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
        <CardContent className="p-4 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600 mr-2" />
          <span className="text-sm text-gray-600">Optimizing route...</span>
        </CardContent>
      </Card>
    );
  }

  if (!optimization) return null;

  const trafficColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-gray-900">AI-Optimized Route</span>
            </div>
            <Badge className={trafficColors[optimization.traffic_level] || trafficColors.medium}>
              {optimization.traffic_level} traffic
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Est. Time</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {optimization.estimated_time_minutes} min
              </p>
            </div>

            {optimization.time_saved_minutes > 0 && (
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600">Time Saved</span>
                </div>
                <p className="text-lg font-bold text-green-700">
                  {optimization.time_saved_minutes} min
                </p>
              </div>
            )}
          </div>

          {optimization.optimal_departure_time && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-600 font-semibold mb-1">OPTIMAL DEPARTURE</p>
              <p className="text-sm text-blue-800">{optimization.optimal_departure_time}</p>
            </div>
          )}

          {optimization.fuel_tip && (
            <div className="text-xs text-gray-600 bg-white rounded-lg p-3">
              💡 {optimization.fuel_tip}
            </div>
          )}

          {optimization.route_recommendation && (
            <div className="text-xs text-indigo-700 bg-indigo-50 rounded-lg p-3 border border-indigo-200">
              <Navigation2 className="w-3 h-3 inline mr-1" />
              {optimization.route_recommendation}
            </div>
          )}

          {optimization.predictive_eta && (
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <p className="text-xs text-purple-600 font-semibold mb-1">PREDICTIVE ETA</p>
              <p className="text-sm text-purple-800">{optimization.predictive_eta}</p>
            </div>
          )}

          {optimization.multi_stop_suggestion && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-blue-600 font-semibold mb-1">MULTI-STOP OPPORTUNITY</p>
              <p className="text-xs text-blue-800">{optimization.multi_stop_suggestion}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}