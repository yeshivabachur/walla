import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PredictiveMaintenanceAlert({ driverEmail, vehicleId }) {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const predictMaintenance = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Predict upcoming maintenance needs.

Vehicle: ${vehicleId}
Current mileage: 45000

Predict:
1. Next 3 maintenance items needed
2. Urgency level for each
3. Predicted failure dates
4. Estimated costs`,
        response_json_schema: {
          type: 'object',
          properties: {
            maintenance_items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  maintenance_type: { type: 'string' },
                  urgency: { type: 'string' },
                  predicted_failure_date: { type: 'string' },
                  estimated_cost: { type: 'number' }
                }
              }
            }
          }
        }
      });

      setPredictions(result.maintenance_items || []);

      for (const item of result.maintenance_items || []) {
        await base44.entities.PredictiveMaintenance.create({
          vehicle_id: vehicleId,
          driver_email: driverEmail,
          prediction_date: new Date().toISOString(),
          maintenance_type: item.maintenance_type,
          urgency: item.urgency,
          predicted_failure_date: item.predicted_failure_date,
          estimated_cost: item.estimated_cost,
          current_mileage: 45000
        });
      }
    };

    predictMaintenance();
  }, [driverEmail, vehicleId]);

  if (predictions.length === 0) return null;

  const urgencyColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-600" />
            Predictive Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {predictions.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 capitalize">
                  {item.maintenance_type.replace(/_/g, ' ')}
                </span>
                <Badge className={urgencyColors[item.urgency]}>
                  {item.urgency}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Due: {item.predicted_failure_date}</span>
                <span className="font-semibold">${item.estimated_cost}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}