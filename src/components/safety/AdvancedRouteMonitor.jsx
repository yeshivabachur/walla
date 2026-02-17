import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdvancedRouteMonitor({ rideRequest }) {
  const [monitoring, setMonitoring] = useState(null);

  useEffect(() => {
    const monitorRoute = async () => {
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Monitor ride safety for route: ${rideRequest.pickup_location} to ${rideRequest.dropoff_location}

Analyze:
- Route safety score
- Known safety concerns
- Alternative safer routes
- Emergency services proximity
- Real-time risk factors

Provide safety assessment.`,
          response_json_schema: {
            type: 'object',
            properties: {
              safety_score: { type: 'number' },
              risk_level: { type: 'string' },
              concerns: { type: 'array', items: { type: 'string' } },
              recommendations: { type: 'string' }
            }
          }
        });

        setMonitoring(result);
      } catch (error) {
        console.error('Route monitoring failed:', error);
      }
    };

    if (rideRequest?.status === 'in_progress') {
      monitorRoute();
      const interval = setInterval(monitorRoute, 30000);
      return () => clearInterval(interval);
    }
  }, [rideRequest]);

  if (!monitoring) return null;

  const riskColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Route Monitor</span>
            </div>
            <Badge className={riskColors[monitoring.risk_level]}>
              {monitoring.risk_level} risk
            </Badge>
          </div>

          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Safety Score</span>
              <span className="text-lg font-bold text-gray-900">
                {monitoring.safety_score}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-full rounded-full transition-all ${
                  monitoring.safety_score > 80 ? 'bg-green-600' :
                  monitoring.safety_score > 60 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${monitoring.safety_score}%` }}
              />
            </div>
          </div>

          {monitoring.concerns?.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-semibold text-yellow-800">
                  Safety Notes
                </span>
              </div>
              <ul className="space-y-1">
                {monitoring.concerns.map((concern, idx) => (
                  <li key={idx} className="text-xs text-yellow-700 ml-6">
                    • {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {monitoring.recommendations && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-800">
                  Recommendations
                </span>
              </div>
              <p className="text-xs text-blue-700">{monitoring.recommendations}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}