import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Cloud, Calendar, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EarningsForecastWidget({ driverEmail }) {
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const generateForecast = async () => {
      const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Forecast ride-share driver earnings for tomorrow.

Driver: ${driverEmail}
Tomorrow: ${dayOfWeek}

Analyze:
1. Predicted earnings range
2. Confidence level (0-100)
3. 3 peak hours
4. 2 recommended zones
5. Key factors (weather, events, day type)`,
        response_json_schema: {
          type: 'object',
          properties: {
            predicted_earnings: { type: 'number' },
            confidence_level: { type: 'number' },
            peak_hours: { type: 'array', items: { type: 'string' } },
            recommended_zones: { type: 'array', items: { type: 'string' } },
            factors: {
              type: 'object',
              properties: {
                weather: { type: 'string' },
                events: { type: 'string' },
                day_type: { type: 'string' }
              }
            }
          }
        }
      });

      setForecast(result);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      await base44.entities.EarningsForecast.create({
        driver_email: driverEmail,
        forecast_date: tomorrow.toISOString().split('T')[0],
        predicted_earnings: result.predicted_earnings,
        confidence_level: result.confidence_level,
        peak_hours: result.peak_hours,
        recommended_zones: result.recommended_zones,
        factors: result.factors
      });
    };

    generateForecast();
  }, [driverEmail]);

  if (!forecast) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Tomorrow's Forecast
            </span>
            <Badge className="bg-indigo-600 text-white">
              {forecast.confidence_level}% confident
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Expected Earnings</p>
            <p className="text-3xl font-bold text-indigo-600">
              ${forecast.predicted_earnings.toFixed(0)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500">Peak Hours</p>
              </div>
              <p className="text-xs font-semibold text-gray-900">
                {forecast.peak_hours?.slice(0, 2).join(', ')}
              </p>
            </div>
            <div className="bg-white rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500">Best Zones</p>
              </div>
              <p className="text-xs font-semibold text-gray-900">
                {forecast.recommended_zones?.[0]}
              </p>
            </div>
          </div>

          {forecast.factors && (
            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200 space-y-1">
              <div className="flex items-center gap-2">
                <Cloud className="w-3 h-3 text-indigo-600" />
                <p className="text-xs text-indigo-800">
                  <span className="font-semibold">Weather:</span> {forecast.factors.weather}
                </p>
              </div>
              {forecast.factors.events && (
                <p className="text-xs text-indigo-800 ml-5">
                  <span className="font-semibold">Events:</span> {forecast.factors.events}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}