import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle } from 'lucide-react';

export default function FraudDetectionMonitor({ userEmail }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const checkFraud = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze user behavior for fraud patterns.

User: ${userEmail}

Check for:
1. Suspicious booking patterns
2. Multiple rapid cancellations
3. Payment irregularities
4. Account age and activity

Provide fraud risk assessment.`,
        response_json_schema: {
          type: 'object',
          properties: {
            risk_level: { type: 'string' },
            patterns_detected: { type: 'array', items: { type: 'string' } },
            recommended_action: { type: 'string' }
          }
        }
      });

      if (result.risk_level !== 'low') {
        await base44.entities.FraudAlert.create({
          user_email: userEmail,
          alert_type: 'suspicious_booking',
          severity: result.risk_level,
          patterns_detected: result.patterns_detected,
          action_taken: result.recommended_action
        });
        setAlerts([result]);
      }
    };

    checkFraud();
  }, [userEmail]);

  if (alerts.length === 0) return null;

  return (
    <Card className="border-2 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="w-5 h-5" />
          Security Alert
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.map((alert, idx) => (
          <div key={idx}>
            <Badge className="bg-red-600 text-white mb-2">{alert.risk_level}</Badge>
            <p className="text-sm text-red-700">{alert.recommended_action}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}