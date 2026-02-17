import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Clock } from 'lucide-react';

export default function SmartSurgeAlert({ currentZone }) {
  const [surgeData, setSurgeData] = useState(null);

  useEffect(() => {
    // Simulate surge monitoring
    const checkSurge = setInterval(() => {
      setSurgeData({
        current_multiplier: 1.8,
        predicted_normal_time: '15 minutes',
        alternative_zones: ['Downtown East', 'Midtown']
      });
    }, 30000);

    return () => clearInterval(checkSurge);
  }, [currentZone]);

  if (!surgeData || surgeData.current_multiplier <= 1.2) return null;

  return (
    <Card className="border-2 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingDown className="w-4 h-4 text-orange-600" />
          Surge Pricing Active
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Badge className="bg-orange-600">{surgeData.current_multiplier}x</Badge>
        <div className="text-xs">
          <p className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Expected normal in {surgeData.predicted_normal_time}
          </p>
          <p className="mt-1 text-gray-600">
            Try: {surgeData.alternative_zones.join(', ')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}