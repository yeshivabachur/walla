import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DynamicPricingInsights({ location }) {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyze current ride-hailing pricing dynamics for ${location} at ${new Date().toLocaleString()}.

Provide ML-powered predictions for:
- Current surge multiplier
- Predicted multiplier in next hour
- Best time to book for lowest price
- Price trend direction
- Confidence level`,
          response_json_schema: {
            type: 'object',
            properties: {
              current_surge: { type: 'number' },
              predicted_surge: { type: 'number' },
              best_time: { type: 'string' },
              trend: { type: 'string' },
              confidence: { type: 'number' },
              savings_tip: { type: 'string' }
            }
          }
        });

        setInsights(result);
      } catch (error) {
        console.error('Failed to fetch pricing insights:', error);
      }
    };

    if (location) fetchInsights();
  }, [location]);

  if (!insights) return null;

  const isIncreasing = insights.predicted_surge > insights.current_surge;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            ML Pricing Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3">
              <p className="text-xs text-gray-600 mb-1">Current</p>
              <p className="text-xl font-bold text-gray-900">{insights.current_surge}x</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-600">Next Hour</p>
                {isIncreasing ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )}
              </div>
              <p className="text-xl font-bold text-gray-900">{insights.predicted_surge}x</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-600 font-semibold mb-1">💡 BEST TIME</p>
            <p className="text-sm text-blue-800">{insights.best_time}</p>
          </div>

          {insights.savings_tip && (
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-green-600 font-semibold mb-1">💰 SAVINGS TIP</p>
              <p className="text-xs text-green-800">{insights.savings_tip}</p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Prediction Confidence</span>
            <Badge className="bg-purple-600 text-white">
              {Math.round(insights.confidence * 100)}%
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}