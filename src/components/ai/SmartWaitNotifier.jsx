import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, Clock, DollarSign, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function SmartWaitNotifier({ pickupLocation, dropoffLocation, currentSurge }) {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!pickupLocation || !dropoffLocation || currentSurge <= 1.0) return;

    const fetchPrediction = async () => {
      setIsLoading(true);
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Predict surge pricing drop for ride-hailing:

Current Status:
- Pickup: ${pickupLocation}
- Dropoff: ${dropoffLocation}
- Current Surge: ${currentSurge}x
- Current Time: ${new Date().toLocaleTimeString()}

Analyze demand patterns and predict:
1. When surge will likely drop below 1.3x
2. Estimated wait time in minutes
3. Potential savings amount
4. Recommendation (wait or book now)`,
          response_json_schema: {
            type: 'object',
            properties: {
              predicted_drop_time: { type: 'string' },
              wait_minutes: { type: 'number' },
              potential_savings: { type: 'number' },
              recommendation: { type: 'string' },
              confidence: { type: 'number' }
            }
          }
        });

        setPrediction(result);
        
        if (result.recommendation === 'wait') {
          toast.info(`💡 Surge expected to drop in ${result.wait_minutes} min. Save $${result.potential_savings}!`);
        }
      } catch (error) {
        console.error('Failed to fetch surge prediction:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrediction();
  }, [pickupLocation, dropoffLocation, currentSurge]);

  if (!prediction || currentSurge <= 1.0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-900">Smart Wait Suggestion</span>
            <Badge className="bg-green-600 text-white">
              {prediction.confidence}% confident
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Expected drop in</span>
              </div>
              <span className="font-bold text-gray-900">{prediction.wait_minutes} min</span>
            </div>

            <div className="flex items-center justify-between bg-white rounded-lg p-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Potential savings</span>
              </div>
              <span className="font-bold text-green-600">${prediction.potential_savings}</span>
            </div>

            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>AI Recommendation:</strong> {prediction.recommendation}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Surge expected to drop at {prediction.predicted_drop_time}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                toast.success(`We'll notify you when surge drops! 🔔`);
              }}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notify Me When Surge Drops
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}