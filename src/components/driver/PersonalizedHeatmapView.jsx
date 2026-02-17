import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp } from 'lucide-react';

export default function PersonalizedHeatmapView({ driverEmail, vehicleType }) {
  const [heatmap, setHeatmap] = useState(null);

  useEffect(() => {
    const generateHeatmap = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate personalized earning heatmap.

Driver: ${driverEmail}
Vehicle: ${vehicleType || 'Standard'}

Analyze zones based on:
1. Vehicle type compatibility
2. Driver's historical performance
3. Current time of day
4. Real-time demand

Provide top 5 zones with earning potential.`,
        response_json_schema: {
          type: 'object',
          properties: {
            zones: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  zone_name: { type: 'string' },
                  earning_potential: { type: 'number' },
                  compatibility_score: { type: 'number' }
                }
              }
            }
          }
        }
      });

      setHeatmap(result);

      await base44.entities.PersonalizedHeatmap.create({
        driver_email: driverEmail,
        vehicle_type: vehicleType || 'Standard',
        zones: result.zones,
        timestamp: new Date().toISOString()
      });
    };

    generateHeatmap();
  }, [driverEmail, vehicleType]);

  if (!heatmap) return null;

  return (
    <Card className="border-2 border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-amber-600" />
          Your Earning Zones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {heatmap.zones?.slice(0, 5).map((zone, idx) => (
          <div key={idx} className="bg-white rounded-lg p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-sm">{zone.zone_name}</span>
            </div>
            <Badge className="bg-green-600 text-white">
              ${zone.earning_potential}/hr
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}