import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, CloudSnow, AlertTriangle } from 'lucide-react';

export default function WeatherPricingIndicator({ location }) {
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    const checkWeather = async () => {
      const weather = await base44.integrations.Core.InvokeLLM({
        prompt: `Get current weather for ${location}. Return condition, temperature, and precipitation probability.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            condition: { type: 'string' },
            temperature: { type: 'number' },
            precipitation: { type: 'number' }
          }
        }
      });

      let multiplier = 1.0;
      if (weather.condition.includes('rain')) multiplier = 1.2;
      if (weather.condition.includes('snow')) multiplier = 1.5;
      if (weather.condition.includes('storm')) multiplier = 1.8;

      await base44.entities.WeatherPricing.create({
        location,
        weather_condition: weather.condition.includes('rain') ? 'rain' : 
                          weather.condition.includes('snow') ? 'snow' : 'clear',
        temperature: weather.temperature,
        precipitation_probability: weather.precipitation,
        price_adjustment: (multiplier - 1) * 100,
        multiplier,
        valid_until: new Date(Date.now() + 3600000).toISOString()
      });

      setPricing({ ...weather, multiplier });
    };

    checkWeather();
  }, [location]);

  if (!pricing || pricing.multiplier === 1.0) return null;

  const getIcon = () => {
    if (pricing.condition.includes('snow')) return CloudSnow;
    if (pricing.condition.includes('rain')) return CloudRain;
    return Cloud;
  };

  const Icon = getIcon();

  return (
    <Card className="border-2 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="w-4 h-4 text-orange-600" />
          Weather Pricing Active
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Badge className="bg-orange-600">{pricing.multiplier}x multiplier</Badge>
        <p className="text-xs text-gray-600 mt-2">Due to {pricing.condition}</p>
      </CardContent>
    </Card>
  );
}