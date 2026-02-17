import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DriverHeatmapInsights({ driverEmail }) {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const analyzeHeatmap = async () => {
      const hour = new Date().getHours();
      const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Provide ride-hailing heatmap insights for driver.

Current time: ${hour}:00
Day: ${dayOfWeek}

Analyze and provide:
1. Top 3 high-demand zones right now
2. Expected surge multiplier for each zone
3. Best zone to head to
4. Estimated wait time in minutes`,
        response_json_schema: {
          type: 'object',
          properties: {
            zones: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  demand: { type: 'string' },
                  surge: { type: 'number' },
                  wait_time: { type: 'number' }
                }
              }
            },
            recommendation: { type: 'string' }
          }
        }
      });

      setInsights(result);
    };

    analyzeHeatmap();
    const interval = setInterval(analyzeHeatmap, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!insights) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Live Demand Zones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {insights.zones?.map((zone, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-semibold">{zone.name}</span>
                </div>
                <Badge className={
                  zone.surge > 1.5 ? 'bg-red-600' :
                  zone.surge > 1.2 ? 'bg-orange-600' : 'bg-green-600'
                }>
                  {zone.surge}x
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600 ml-6">
                <span>{zone.demand} demand</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {zone.wait_time}m wait
                </span>
              </div>
            </motion.div>
          ))}

          {insights.recommendation && (
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 mt-3">
              <p className="text-xs font-semibold text-orange-800 mb-1">
                💡 Recommendation
              </p>
              <p className="text-xs text-orange-700">{insights.recommendation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}