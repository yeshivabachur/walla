import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OperationalDashboard({ zone }) {
  const [metrics, setMetrics] = useState(null);

  const { data: todayRides = [] } = useQuery({
    queryKey: ['todayRides', zone],
    queryFn: () => base44.entities.RideRequest.filter({
      created_date: { $gte: new Date().toISOString().split('T')[0] }
    })
  });

  useEffect(() => {
    if (todayRides.length === 0) return;

    const analyzeMetrics = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze operational metrics for ${zone}.

Total rides today: ${todayRides.length}
Completed: ${todayRides.filter(r => r.status === 'completed').length}
Cancelled: ${todayRides.filter(r => r.status === 'cancelled').length}

Calculate:
1. Average wait time (minutes)
2. Cancellation rate (%)
3. Customer satisfaction estimate
4. Peak hours (top 3)
5. Revenue generated`,
        response_json_schema: {
          type: 'object',
          properties: {
            avg_wait_time: { type: 'number' },
            cancellation_rate: { type: 'number' },
            customer_satisfaction: { type: 'number' },
            peak_hours: { type: 'array', items: { type: 'string' } },
            revenue: { type: 'number' }
          }
        }
      });

      setMetrics(result);

      await base44.entities.OperationalMetrics.create({
        date: new Date().toISOString().split('T')[0],
        zone,
        total_rides: todayRides.length,
        active_drivers: 0,
        avg_wait_time: result.avg_wait_time,
        cancellation_rate: result.cancellation_rate,
        customer_satisfaction: result.customer_satisfaction,
        revenue: result.revenue,
        peak_hours: result.peak_hours
      });
    };

    analyzeMetrics();
  }, [todayRides, zone]);

  if (!metrics) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Operations Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-600">Avg Wait</p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {metrics.avg_wait_time} min
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-600">Satisfaction</p>
              </div>
              <p className="text-xl font-bold text-green-600">
                {metrics.customer_satisfaction}%
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-2">Peak Hours</p>
            <div className="flex gap-2">
              {metrics.peak_hours?.map((hour, idx) => (
                <Badge key={idx} className="bg-blue-600 text-white">
                  {hour}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 mb-1">Today's Revenue</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${metrics.revenue?.toFixed(0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Cancellation Rate</p>
                <p className="text-sm font-semibold text-gray-900">
                  {metrics.cancellation_rate}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}