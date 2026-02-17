import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingStrategyEngine({ zone, currentPrice }) {
  const [strategy, setStrategy] = useState(null);

  useEffect(() => {
    const analyzeStrategy = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze optimal pricing strategy for ${zone}.

Current price: $${currentPrice}

Determine:
1. Strategy type (competitive/premium/discount/dynamic)
2. Optimal multiplier
3. Market position vs competitors
4. Demand elasticity
5. Revenue projection`,
        response_json_schema: {
          type: 'object',
          properties: {
            strategy_type: { type: 'string' },
            base_multiplier: { type: 'number' },
            competitor_analysis: {
              type: 'object',
              properties: {
                market_position: { type: 'string' },
                price_advantage: { type: 'number' }
              }
            },
            demand_elasticity: { type: 'number' },
            revenue_projection: { type: 'number' }
          }
        }
      });

      setStrategy(result);

      await base44.entities.PricingStrategy.create({
        zone,
        timestamp: new Date().toISOString(),
        strategy_type: result.strategy_type,
        base_multiplier: result.base_multiplier,
        competitor_analysis: result.competitor_analysis,
        demand_elasticity: result.demand_elasticity,
        revenue_projection: result.revenue_projection
      });
    };

    analyzeStrategy();
  }, [zone, currentPrice]);

  if (!strategy) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Smart Pricing
            </span>
            <Badge className="bg-emerald-600 text-white capitalize">
              {strategy.strategy_type}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Market Position</p>
            <p className="text-sm font-semibold text-gray-900">
              {strategy.competitor_analysis?.market_position}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-3 h-3 text-emerald-600" />
                <p className="text-xs text-gray-600">Multiplier</p>
              </div>
              <p className="text-sm font-bold text-gray-900">{strategy.base_multiplier}x</p>
            </div>
            <div className="bg-white rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <p className="text-xs text-gray-600">Revenue</p>
              </div>
              <p className="text-sm font-bold text-gray-900">
                ${strategy.revenue_projection}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}