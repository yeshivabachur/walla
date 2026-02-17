import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, CloudSnow, CloudLightning, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const weatherIcons = {
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
  fog: Cloud
};

export default function WeatherAwareRouting({ location }) {
  const { data: weatherData } = useQuery({
    queryKey: ['weather', location],
    queryFn: async () => {
      // Simulate fetching weather alerts
      const alerts = await base44.entities.WeatherAlert.filter({ 
        location: location,
        active: true
      });
      
      if (alerts.length > 0) return alerts[0];
      
      // Use AI to fetch current weather
      const weather = await base44.integrations.Core.InvokeLLM({
        prompt: `Get current weather for ${location}. Return only: condition (clear/rain/snow/storm/fog), temperature in F, and brief impact on driving.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            condition: { type: 'string' },
            temperature: { type: 'number' },
            driving_impact: { type: 'string' }
          }
        }
      });
      
      return weather;
    },
    enabled: !!location
  });

  if (!weatherData || weatherData.condition === 'clear') return null;

  const WeatherIcon = weatherIcons[weatherData.condition] || Cloud;
  const isAlert = weatherData.severity === 'high' || weatherData.severity === 'severe';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`border-0 ${isAlert ? 'bg-orange-50 border-2 border-orange-300' : 'bg-blue-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <WeatherIcon className={`w-5 h-5 mt-0.5 ${isAlert ? 'text-orange-600' : 'text-blue-600'}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">Weather Alert</span>
                {isAlert && <Badge className="bg-orange-600 text-white">⚠️ High</Badge>}
              </div>
              <p className="text-sm text-gray-600">
                {weatherData.driving_impact || weatherData.impact_on_rides}
              </p>
              {weatherData.recommendation && (
                <p className="text-xs text-gray-500 mt-2">
                  💡 {weatherData.recommendation}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}