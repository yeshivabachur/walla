import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, TrendingUp, AlertCircle } from 'lucide-react';

export default function PrivatePerformanceFeedback({ driverEmail }) {
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const generateFeedback = async () => {
      const rides = await base44.entities.RideRequest.filter({ driver_email: driverEmail });
      const reviews = await base44.entities.Review.filter({ reviewee_email: driverEmail });

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate private performance feedback for driver.

Total rides: ${rides.length}
Average rating: ${reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2) : 'N/A'}

Provide:
1. 3 key strengths
2. 2 areas for improvement
3. 3 actionable tips
4. Overall performance score (0-100)`,
        response_json_schema: {
          type: 'object',
          properties: {
            strengths: { type: 'array', items: { type: 'string' } },
            improvements: { type: 'array', items: { type: 'string' } },
            tips: { type: 'array', items: { type: 'string' } },
            score: { type: 'number' }
          }
        }
      });

      setFeedback(result);

      await base44.entities.PerformanceFeedback.create({
        driver_email: driverEmail,
        feedback_date: new Date().toISOString().split('T')[0],
        strengths: result.strengths,
        areas_for_improvement: result.improvements,
        actionable_tips: result.tips,
        overall_score: result.score,
        private: true
      });
    };

    generateFeedback();
  }, [driverEmail]);

  if (!feedback) return null;

  return (
    <Card className="border-2 border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Lock className="w-4 h-4 text-purple-600" />
          Private Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-white rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Performance Score</span>
            <Badge className="bg-purple-600 text-white">{feedback.score}/100</Badge>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <p className="text-xs font-semibold text-green-800 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Strengths
          </p>
          {feedback.strengths?.map((s, idx) => (
            <p key={idx} className="text-xs text-green-700 mb-1">✓ {s}</p>
          ))}
        </div>

        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <p className="text-xs font-semibold text-orange-800 mb-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Growth Areas
          </p>
          {feedback.improvements?.map((i, idx) => (
            <p key={idx} className="text-xs text-orange-700 mb-1">→ {i}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}