import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AutoDispatchOptimizer({ zone }) {
  const [optimization, setOptimization] = useState(null);

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pendingRequests', zone],
    queryFn: () => base44.entities.RideRequest.filter({ status: 'pending' }),
    refetchInterval: 5000
  });

  const { data: activeDrivers = [] } = useQuery({
    queryKey: ['activeDrivers', zone],
    queryFn: () => base44.entities.DriverProfile.filter({ status: 'online' })
  });

  useEffect(() => {
    if (pendingRequests.length === 0) return;

    const optimize = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Optimize dispatch for ${zone}.

Pending requests: ${pendingRequests.length}
Available drivers: ${activeDrivers.length}

Determine:
1. Best optimization strategy
2. Efficiency score (0-100)
3. Average pickup time estimate
4. Recommendations for improvement`,
        response_json_schema: {
          type: 'object',
          properties: {
            optimization_strategy: { type: 'string' },
            efficiency_score: { type: 'number' },
            avg_pickup_time: { type: 'number' },
            recommendations: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setOptimization(result);

      await base44.entities.DispatchOptimization.create({
        timestamp: new Date().toISOString(),
        zone,
        available_drivers: activeDrivers.length,
        pending_requests: pendingRequests.length,
        optimization_strategy: result.optimization_strategy,
        efficiency_score: result.efficiency_score,
        avg_pickup_time: result.avg_pickup_time,
        recommendations: result.recommendations
      });
    };

    optimize();
  }, [pendingRequests, activeDrivers, zone]);

  if (!optimization) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-600" />
              Dispatch Optimizer
            </span>
            <Badge className="bg-violet-600 text-white">
              {optimization.efficiency_score}% efficient
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-violet-600" />
                <p className="text-xs text-gray-600">Pending</p>
              </div>
              <p className="text-2xl font-bold text-violet-600">
                {pendingRequests.length}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-violet-600" />
                <p className="text-xs text-gray-600">Avg Pickup</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {optimization.avg_pickup_time}m
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Strategy</p>
            <p className="text-sm font-semibold text-gray-900">
              {optimization.optimization_strategy}
            </p>
          </div>

          {optimization.recommendations?.length > 0 && (
            <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
              <p className="text-xs font-semibold text-violet-800 mb-2">Recommendations</p>
              {optimization.recommendations.slice(0, 2).map((rec, idx) => (
                <p key={idx} className="text-xs text-violet-700 mb-1">• {rec}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}