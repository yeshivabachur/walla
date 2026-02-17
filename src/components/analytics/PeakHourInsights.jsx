import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from 'lucide-react';

export default function PeakHourInsights({ zone }) {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const analyze = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze peak hours for zone.

Zone: ${zone}
Day: ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}

Identify:
1. Peak hours (top 3)
2. Average demand level
3. Recommended driver count`,
        response_json_schema: {
          type: 'object',
          properties: {
            peak_hours: { type: 'array', items: { type: 'string' } },
            avg_demand: { type: 'number' },
            recommended_drivers: { type: 'number' }
          }
        }
      });

      setAnalysis(result);

      await base44.entities.PeakHourAnalysis.create({
        zone: zone,
        day_of_week: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
        peak_hours: result.peak_hours,
        average_demand: result.avg_demand,
        recommended_driver_count: result.recommended_drivers
      });
    };

    analyze();
  }, [zone]);

  if (!analysis) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-blue-600" />
          Peak Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {analysis.peak_hours?.map((hour, idx) => (
            <div key={idx} className="text-sm bg-blue-50 rounded p-2">
              {hour}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}