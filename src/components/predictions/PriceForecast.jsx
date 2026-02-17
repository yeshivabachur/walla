import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PriceForecast({ pickup, dropoff }) {
  const { data: forecast } = useQuery({
    queryKey: ['priceForecast', pickup, dropoff],
    queryFn: async () => {
      const prediction = await base44.integrations.Core.InvokeLLM({
        prompt: `Predict ride prices from ${pickup} to ${dropoff} for next 24 hours. Consider typical traffic patterns, events, weather. Return hourly predictions with: hour (HH:00), price (number), surge_probability (0-1), recommendation.`,
        response_json_schema: {
          type: 'object',
          properties: {
            predictions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  hour: { type: 'string' },
                  price: { type: 'number' },
                  surge_probability: { type: 'number' },
                  recommendation: { type: 'string' }
                }
              }
            },
            best_time: { type: 'string' },
            savings: { type: 'number' }
          }
        }
      });

      return prediction;
    },
    enabled: !!pickup && !!dropoff
  });

  if (!forecast || !forecast.predictions) return null;

  const topPredictions = forecast.predictions.slice(0, 4);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            AI Price Forecast
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">Best Time to Ride</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600 mb-1">{forecast.best_time}</p>
            <p className="text-sm text-green-600 flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              Save up to ${forecast.savings?.toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-900">Upcoming Prices</p>
            {topPredictions.map((pred, i) => (
              <div key={i} className="bg-white rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{pred.hour}</p>
                  <p className="text-xs text-gray-600">{pred.recommendation}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${pred.price}</p>
                  {pred.surge_probability > 0.5 && (
                    <Badge className="bg-orange-100 text-orange-800 text-xs mt-1">
                      High Demand
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}