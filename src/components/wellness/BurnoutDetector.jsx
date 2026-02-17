import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BurnoutDetector({ driverEmail }) {
  const [assessment, setAssessment] = useState(null);

  const { data: recentRides = [] } = useQuery({
    queryKey: ['burnoutRides', driverEmail],
    queryFn: () => base44.entities.RideRequest.filter({
      driver_email: driverEmail,
      status: 'completed'
    }, '-created_date', 30)
  });

  useEffect(() => {
    if (recentRides.length < 10) return;

    const assessBurnout = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Assess driver burnout risk.

Recent rides: ${recentRides.length}
Time period: Last 30 days

Analyze:
1. Burnout score (0-100)
2. Risk level (low/medium/high/critical)
3. Contributing factors
4. 3 recommendations
5. Rest days needed`,
        response_json_schema: {
          type: 'object',
          properties: {
            burnout_score: { type: 'number' },
            risk_level: { type: 'string' },
            contributing_factors: { type: 'array', items: { type: 'string' } },
            recommendations: { type: 'array', items: { type: 'string' } },
            rest_days_suggested: { type: 'number' }
          }
        }
      });

      setAssessment(result);

      await base44.entities.DriverBurnout.create({
        driver_email: driverEmail,
        assessment_date: new Date().toISOString().split('T')[0],
        burnout_score: result.burnout_score,
        risk_level: result.risk_level,
        contributing_factors: result.contributing_factors,
        recommendations: result.recommendations,
        rest_days_suggested: result.rest_days_suggested
      });
    };

    assessBurnout();
  }, [recentRides, driverEmail]);

  if (!assessment) return null;

  const riskColors = {
    low: 'bg-green-600',
    medium: 'bg-yellow-600',
    high: 'bg-orange-600',
    critical: 'bg-red-600'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Wellness Check
            </span>
            <Badge className={`${riskColors[assessment.risk_level]} text-white`}>
              {assessment.risk_level.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Burnout Score</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${assessment.burnout_score > 70 ? 'bg-red-600' : assessment.burnout_score > 40 ? 'bg-yellow-600' : 'bg-green-600'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${assessment.burnout_score}%` }}
                />
              </div>
              <span className="text-lg font-bold text-gray-900">{assessment.burnout_score}</span>
            </div>
          </div>

          {assessment.burnout_score > 50 && (
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-xs font-semibold text-red-800">Recommendations</p>
              </div>
              {assessment.recommendations?.map((rec, idx) => (
                <p key={idx} className="text-xs text-red-700 mb-1">• {rec}</p>
              ))}
            </div>
          )}

          {assessment.rest_days_suggested > 0 && (
            <Button className="w-full bg-red-600 hover:bg-red-700" size="sm">
              Schedule {assessment.rest_days_suggested} Rest Days
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}