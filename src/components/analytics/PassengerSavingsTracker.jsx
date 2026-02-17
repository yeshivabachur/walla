import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PassengerSavingsTracker({ userEmail }) {
  const [savings, setSavings] = useState(null);

  const { data: rides = [] } = useQuery({
    queryKey: ['userCompletedRides', userEmail],
    queryFn: () => base44.entities.RideRequest.filter({
      passenger_email: userEmail,
      status: 'completed'
    })
  });

  useEffect(() => {
    if (rides.length < 3) return;

    const analyzeSavings = async () => {
      const totalSpent = rides.reduce((sum, r) => sum + (r.estimated_price || 0), 0);
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze passenger's ride savings and optimization opportunities.

Total rides: ${rides.length}
Total spent: $${totalSpent.toFixed(2)}

Calculate:
1. Potential savings from better timing (avoiding surge)
2. Savings from ride pooling opportunities
3. Total potential savings
4. Best money-saving tips`,
        response_json_schema: {
          type: 'object',
          properties: {
            surge_savings: { type: 'number' },
            pool_savings: { type: 'number' },
            total_potential: { type: 'number' },
            tips: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setSavings(result);
    };

    analyzeSavings();
  }, [rides, userEmail]);

  if (!savings) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-green-600" />
            Savings Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Potential Savings</span>
              <span className="text-2xl font-bold text-green-600">
                ${savings.total_potential.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 rounded-lg p-2 border border-green-200">
              <p className="text-xs text-green-600">Timing</p>
              <p className="text-sm font-bold text-green-800">
                ${savings.surge_savings.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-2 border border-green-200">
              <p className="text-xs text-green-600">Pooling</p>
              <p className="text-sm font-bold text-green-800">
                ${savings.pool_savings.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-600" />
              <p className="text-xs font-semibold text-gray-700">Money-Saving Tips</p>
            </div>
            {savings.tips?.map((tip, idx) => (
              <div key={idx} className="bg-white rounded-lg p-2 text-xs text-gray-700">
                💡 {tip}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}