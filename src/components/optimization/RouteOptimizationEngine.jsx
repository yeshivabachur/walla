import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Zap, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RouteOptimizationEngine({ pickup, dropoff }) {
  const [optimization, setOptimization] = useState(null);

  useEffect(() => {
    if (!pickup || !dropoff) return;

    const optimize = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Advanced route optimization for ${pickup} to ${dropoff}.

Analyze:
1. Fastest route with real-time traffic
2. Most fuel-efficient route
3. Scenic alternative route
4. Time savings vs fuel savings trade-off

Provide route recommendation with reasoning.`,
        response_json_schema: {
          type: 'object',
          properties: {
            recommended_route: { type: 'string' },
            time_saved: { type: 'number' },
            fuel_saved: { type: 'number' },
            reasoning: { type: 'string' }
          }
        }
      });

      setOptimization(result);
    };

    optimize();
  }, [pickup, dropoff]);

  if (!optimization) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-gray-900">Optimized Route</span>
          </div>
          
          <p className="text-xs text-gray-700">{optimization.reasoning}</p>

          <div className="flex gap-2">
            {optimization.time_saved > 0 && (
              <div className="bg-white rounded px-2 py-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-gray-700">-{optimization.time_saved} min</span>
              </div>
            )}
            {optimization.fuel_saved > 0 && (
              <div className="bg-white rounded px-2 py-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-green-600" />
                <span className="text-xs text-gray-700">-{optimization.fuel_saved}L fuel</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}