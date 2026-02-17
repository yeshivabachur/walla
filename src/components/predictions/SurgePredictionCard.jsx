import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SurgePredictionCard({ zone }) {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const predict = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Predict surge pricing for ${zone} area.

Current time: ${new Date().toLocaleTimeString()}
Day: ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}

Predict:
1. Current surge multiplier
2. Surge in 1 hour
3. Surge in 2 hours
4. Confidence level (0-100)
5. Best time to book recommendation`,
        response_json_schema: {
          type: 'object',
          properties: {
            current_surge: { type: 'number' },
            predicted_surge_1h: { type: 'number' },
            predicted_surge_2h: { type: 'number' },
            confidence: { type: 'number' },
            recommendation: { type: 'string' }
          }
        }
      });

      setPrediction(result);
      
      await base44.entities.SurgePrediction.create({
        zone,
        prediction_time: new Date().toISOString(),
        current_surge: result.current_surge,
        predicted_surge_1h: result.predicted_surge_1h,
        predicted_surge_2h: result.predicted_surge_2h,
        confidence: result.confidence,
        recommendation: result.recommendation
      });
    };

    predict();
  }, [zone]);

  if (!prediction) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Surge Forecast
            </span>
            <Badge className="bg-orange-600 text-white">
              {prediction.confidence}% accurate
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500">Now</p>
              <p className="text-lg font-bold text-orange-600">{prediction.current_surge}x</p>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500">1hr</p>
              <p className="text-lg font-bold text-gray-900">{prediction.predicted_surge_1h}x</p>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500">2hr</p>
              <p className="text-lg font-bold text-gray-900">{prediction.predicted_surge_2h}x</p>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 flex items-start gap-2">
            <Clock className="w-4 h-4 text-orange-600 mt-0.5" />
            <p className="text-xs text-orange-800">{prediction.recommendation}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}