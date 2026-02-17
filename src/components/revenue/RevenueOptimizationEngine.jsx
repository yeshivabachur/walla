import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RevenueOptimizationEngine({ zone }) {
  const [optimization, setOptimization] = useState(null);

  const { data: rides = [] } = useQuery({
    queryKey: ['revenueRides', zone],
    queryFn: () => base44.entities.RideRequest.filter({ 
      status: 'completed',
      created_date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    })
  });

  useEffect(() => {
    if (rides.length === 0) return;

    const analyzeRevenue = async () => {
      const totalRevenue = rides.reduce((sum, r) => sum + (r.estimated_price || 0), 0);

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze revenue optimization for ${zone}.

Current week revenue: $${totalRevenue}
Total rides: ${rides.length}

Identify:
1. Projected revenue for next week
2. Top 3 optimization opportunities with potential increase %
3. Recommended actions for revenue growth`,
        response_json_schema: {
          type: 'object',
          properties: {
            projected_revenue: { type: 'number' },
            optimization_opportunities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  opportunity: { type: 'string' },
                  potential_increase: { type: 'number' }
                }
              }
            },
            recommended_actions: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setOptimization({ ...result, current_revenue: totalRevenue });

      await base44.entities.RevenueOptimization.create({
        analysis_date: new Date().toISOString().split('T')[0],
        zone,
        current_revenue: totalRevenue,
        projected_revenue: result.projected_revenue,
        optimization_opportunities: result.optimization_opportunities,
        recommended_actions: result.recommended_actions
      });
    };

    analyzeRevenue();
  }, [rides, zone]);

  if (!optimization) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Revenue Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Current</p>
              <p className="text-xl font-bold text-gray-900">
                ${optimization.current_revenue.toFixed(0)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Projected</p>
              <p className="text-xl font-bold text-emerald-600">
                ${optimization.projected_revenue.toFixed(0)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {optimization.optimization_opportunities?.slice(0, 2).map((opp, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-900">{opp.opportunity}</p>
                  <Badge className="bg-emerald-600 text-white">
                    +{opp.potential_increase}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
            <p className="text-xs font-semibold text-emerald-800 mb-1">Action Items</p>
            {optimization.recommended_actions?.slice(0, 2).map((action, idx) => (
              <p key={idx} className="text-xs text-emerald-700 mb-1">• {action}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}