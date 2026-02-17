import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';

export default function EarningsOptimizer({ driverEmail }) {
  const [optimization, setOptimization] = useState(null);

  useEffect(() => {
    const optimize = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Optimize earnings for driver.

Driver: ${driverEmail}

Analyze and provide:
1. Current hourly rate
2. Potential hourly rate
3. 3 optimization tips
4. Best hours to drive`,
        response_json_schema: {
          type: 'object',
          properties: {
            current_rate: { type: 'number' },
            potential_rate: { type: 'number' },
            tips: { type: 'array', items: { type: 'string' } },
            best_hours: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setOptimization(result);

      await base44.entities.EarningsOptimization.create({
        driver_email: driverEmail,
        analysis_date: new Date().toISOString().split('T')[0],
        current_hourly_rate: result.current_rate,
        potential_hourly_rate: result.potential_rate,
        optimization_tips: result.tips,
        best_hours: result.best_hours
      });
    };

    optimize();
  }, [driverEmail]);

  if (!optimization) return null;

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-green-600" />
          Earnings Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Current Rate</span>
          <Badge className="bg-gray-600 text-white">${optimization.current_rate}/hr</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Potential Rate</span>
          <Badge className="bg-green-600 text-white">${optimization.potential_rate}/hr</Badge>
        </div>
        <div>
          <p className="text-xs font-semibold mb-1">Optimization Tips:</p>
          {optimization.tips?.slice(0, 3).map((tip, idx) => (
            <p key={idx} className="text-xs text-gray-700">• {tip}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}