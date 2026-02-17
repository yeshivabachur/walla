import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Navigation, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RiskAssessmentDisplay({ route }) {
  const [riskData, setRiskData] = useState(null);

  useEffect(() => {
    if (!route?.pickup_location || !route?.dropoff_location) return;

    const assessRisk = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Assess safety risk for ride route:

Route: ${route.pickup_location} to ${route.dropoff_location}
Time: ${new Date().toLocaleTimeString()}
Date: ${new Date().toLocaleDateString()}

Provide:
1. Overall risk level (low/moderate/high)
2. Specific safety considerations
3. Alternative safer routes if needed
4. Safety recommendations for driver and passenger`,
        response_json_schema: {
          type: 'object',
          properties: {
            risk_level: { type: 'string' },
            considerations: { type: 'array', items: { type: 'string' } },
            alternative_routes: { type: 'array', items: { type: 'string' } },
            recommendations: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setRiskData(result);
    };

    assessRisk();
  }, [route]);

  if (!riskData) return null;

  const riskConfig = {
    low: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Low Risk' },
    moderate: { color: 'bg-yellow-100 text-yellow-800', icon: Shield, label: 'Moderate Risk' },
    high: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, label: 'High Risk' }
  };

  const config = riskConfig[riskData.risk_level] || riskConfig.low;
  const RiskIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-gray-900">Safety Assessment</span>
            </div>
            <Badge className={config.color}>
              <RiskIcon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </div>

          {riskData.considerations?.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-xs font-semibold text-gray-900 mb-2">⚠️ Considerations</p>
              <ul className="space-y-1">
                {riskData.considerations.map((item, i) => (
                  <li key={i} className="text-xs text-gray-700">• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {riskData.alternative_routes?.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <p className="text-xs font-semibold text-blue-900 mb-2">
                <Navigation className="w-3 h-3 inline mr-1" />
                Alternative Routes
              </p>
              <ul className="space-y-1">
                {riskData.alternative_routes.map((route, i) => (
                  <li key={i} className="text-xs text-blue-800">• {route}</li>
                ))}
              </ul>
            </div>
          )}

          {riskData.recommendations?.length > 0 && (
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-900 mb-2">✓ Safety Tips</p>
              <ul className="space-y-1">
                {riskData.recommendations.map((rec, i) => (
                  <li key={i} className="text-xs text-green-800">• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}