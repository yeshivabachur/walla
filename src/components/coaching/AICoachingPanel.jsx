import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from 'lucide-react';

export default function AICoachingPanel({ driverEmail }) {
  const [coaching, setCoaching] = useState(null);

  useEffect(() => {
    const getCoaching = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Provide coaching insights for driver.

Driver: ${driverEmail}

Focus areas:
1. Customer service
2. Efficiency
3. Safety

Provide 3 insights and 3 action items with progress score.`,
        response_json_schema: {
          type: 'object',
          properties: {
            focus: { type: 'string' },
            insights: { type: 'array', items: { type: 'string' } },
            actions: { type: 'array', items: { type: 'string' } },
            score: { type: 'number' }
          }
        }
      });

      setCoaching(result);

      await base44.entities.DriverCoachingSession.create({
        driver_email: driverEmail,
        session_date: new Date().toISOString(),
        focus_area: result.focus,
        ai_insights: result.insights,
        action_items: result.actions,
        progress_score: result.score
      });
    };

    getCoaching();
  }, [driverEmail]);

  if (!coaching) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          AI Coaching
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs font-semibold text-blue-900">{coaching.focus}</p>
        {coaching.insights?.slice(0, 3).map((insight, idx) => (
          <p key={idx} className="text-xs text-gray-700">💡 {insight}</p>
        ))}
      </CardContent>
    </Card>
  );
}