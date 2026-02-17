import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Sun, Snowflake, Wind, Thermometer, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const weatherIcons = {
  sunny: Sun,
  rainy: CloudRain,
  snowy: Snowflake,
  windy: Wind,
  hot: Thermometer,
  cold: Snowflake
};

export default function WeatherVehicleMatch({ location }) {
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!location) return;

    const fetchRecommendation = async () => {
      setIsLoading(true);
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Based on current weather conditions in ${location}, recommend the best vehicle type and features for a ride.

Consider:
- Weather conditions (temperature, precipitation, visibility)
- Passenger comfort needs
- Safety considerations

Provide vehicle recommendation with specific features.`,
          response_json_schema: {
            type: 'object',
            properties: {
              weather: { type: 'string' },
              vehicle: { type: 'string' },
              features: { type: 'array', items: { type: 'string' } },
              tips: { type: 'string' }
            }
          }
        });

        setRecommendation(result);
      } catch (error) {
        console.error('Failed to fetch weather recommendation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendation();
  }, [location]);

  if (!recommendation || isLoading) return null;

  const WeatherIcon = weatherIcons[recommendation.weather?.toLowerCase()] || Sun;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-cyan-300 bg-gradient-to-br from-cyan-50 to-blue-50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <WeatherIcon className="w-5 h-5 text-cyan-600" />
              Weather-Adapted Vehicle
            </span>
            <Badge className="bg-cyan-600 text-white">
              {recommendation.weather}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-xl p-4">
            <p className="font-semibold text-gray-900 mb-2">
              🚗 Recommended: {recommendation.vehicle}
            </p>
            <div className="space-y-1">
              {recommendation.features?.map((feature, idx) => (
                <div key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">
                    ✓ {feature}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {recommendation.tips && (
            <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-800">{recommendation.tips}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}