import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock } from 'lucide-react';

export default function SurgePredictionCard({ driverEmail, currentZone }) {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const predict = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Predict surge pricing for ${currentZone} in the next 2 hours. Consider time of day, day of week, and typical patterns.`,
        response_json_schema: {
          type: 'object',
          properties: {
            predicted_multiplier: { type: 'number' },
            confidence: { type: 'number' },
            factors: { type: 'array', items: { type: 'string' } },
            recommended_action: { type: 'string' }
          }
        }
      });

      await base44.entities.SurgePrediction.create({
        zone: currentZone,
        prediction_time: new Date().toISOString(),
        predicted_multiplier: result.predicted_multiplier,
        confidence: result.confidence,
        factors: result.factors,
        recommended_action: result.recommended_action
      });

      setPrediction(result);
    };

    predict();
  }, [currentZone]);

  if (!prediction) return null;

  return (
    <Card className="border-2 border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          Surge Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="bg-white rounded p-2">
          <p className="text-xs text-gray-600">Next 2 hours</p>
          <p className="text-2xl font-bold text-purple-600">{prediction.predicted_multiplier}x</p>
          <Badge className="bg-purple-600">{Math.round(prediction.confidence * 100)}% confident</Badge>
        </div>
        <div className="text-xs">
          <p className="font-semibold mb-1">Factors:</p>
          {prediction.factors?.slice(0, 2).map((f, idx) => (
            <p key={idx} className="text-gray-600">• {f}</p>
          ))}
        </div>
        <p className="text-xs text-purple-700 font-semibold">{prediction.recommended_action}</p>
      </CardContent>
    </Card>
  );
}