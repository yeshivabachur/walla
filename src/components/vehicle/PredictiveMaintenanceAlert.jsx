import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Wrench, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PredictiveMaintenanceAlert({ vehicleId, driverEmail }) {
  const [predictions, setPredictions] = useState(null);

  useEffect(() => {
    const analyzeMaintenance = async () => {
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Predict vehicle maintenance needs for vehicle ${vehicleId}.

Analyze based on:
- Current mileage and usage patterns
- Last service date
- Typical wear and tear
- Seasonal factors

Provide 3 predicted maintenance items with dates and severity.`,
          response_json_schema: {
            type: 'object',
            properties: {
              health_score: { type: 'number' },
              issues: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    issue: { type: 'string' },
                    severity: { type: 'string' },
                    predicted_date: { type: 'string' },
                    confidence: { type: 'number' }
                  }
                }
              }
            }
          }
        });

        setPredictions(result);

        // Save to database
        await base44.entities.VehicleHealth.create({
          vehicle_id: vehicleId,
          driver_email: driverEmail,
          health_score: result.health_score,
          mileage: 45000,
          predicted_issues: result.issues
        });
      } catch (error) {
        console.error('Maintenance prediction failed:', error);
      }
    };

    if (vehicleId) analyzeMaintenance();
  }, [vehicleId, driverEmail]);

  if (!predictions) return null;

  const severityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-red-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-600" />
            Vehicle Health
          </span>
          <Badge className={predictions.health_score > 80 ? 'bg-green-600' : 'bg-orange-600'}>
            {predictions.health_score}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {predictions.issues?.map((issue, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-lg p-3"
          >
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-semibold text-gray-900">{issue.issue}</p>
              <Badge className={severityColors[issue.severity]}>
                {issue.severity}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Calendar className="w-3 h-3" />
              {issue.predicted_date}
              <span>•</span>
              <span>{Math.round(issue.confidence * 100)}% confidence</span>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}