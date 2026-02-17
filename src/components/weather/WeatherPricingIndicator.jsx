import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Snowflake, Wind, Cloud } from 'lucide-react';

export default function WeatherPricingIndicator({ zone }) {
  const [weatherPricing, setWeatherPricing] = useState(null);

  useEffect(() => {
    const checkWeatherPricing = async () => {
      const active = await base44.entities.WeatherPricing.filter({ zone, active: true });
      if (active.length > 0) {
        setWeatherPricing(active[0]);
      }
    };
    checkWeatherPricing();
  }, [zone]);

  if (!weatherPricing) return null;

  const icons = {
    rain: CloudRain,
    snow: Snowflake,
    storm: Wind,
    fog: Cloud
  };

  const Icon = icons[weatherPricing.weather_condition] || Cloud;

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="w-4 h-4 text-blue-600" />
          Weather Pricing Active
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-600 capitalize">{weatherPricing.weather_condition}</p>
            <p className="text-xs text-gray-600 capitalize">Severity: {weatherPricing.severity}</p>
          </div>
          <Badge className="bg-blue-600">
            {weatherPricing.price_multiplier}x pricing
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}