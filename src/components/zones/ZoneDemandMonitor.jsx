import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp } from 'lucide-react';

export default function ZoneDemandMonitor() {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    const monitor = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Monitor demand across zones.

Time: ${new Date().toLocaleTimeString()}

Provide 3 zones with:
1. Current demand level
2. Available drivers
3. Surge multiplier`,
        response_json_schema: {
          type: 'object',
          properties: {
            zones: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  demand: { type: 'number' },
                  drivers: { type: 'number' },
                  surge: { type: 'number' }
                }
              }
            }
          }
        }
      });

      setZones(result.zones || []);

      for (const z of result.zones || []) {
        await base44.entities.ZoneDemand.create({
          zone_name: z.name,
          current_demand: z.demand,
          available_drivers: z.drivers,
          surge_multiplier: z.surge,
          timestamp: new Date().toISOString()
        });
      }
    };

    monitor();
  }, []);

  if (zones.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          Zone Demand
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {zones.map((z, idx) => (
          <div key={idx} className="bg-indigo-50 rounded-lg p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold">{z.name}</span>
            </div>
            <Badge className={z.surge > 1.5 ? 'bg-red-600' : 'bg-green-600'}>{z.surge}x</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}