import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIShiftOptimizer({ driverEmail }) {
  const [shiftPlan, setShiftPlan] = useState(null);

  useEffect(() => {
    const optimizeShift = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Optimize tomorrow's driving shift.

Driver: ${driverEmail}
Current day: ${new Date().toLocaleDateString()}

Analyze:
1. Historical demand patterns
2. Upcoming events
3. Weather forecast
4. Driver's typical performance

Provide optimal shift plan with expected earnings.`,
        response_json_schema: {
          type: 'object',
          properties: {
            recommended_start: { type: 'string' },
            recommended_end: { type: 'string' },
            predicted_earnings: { type: 'number' },
            predicted_rides: { type: 'number' },
            optimal_zones: { type: 'array', items: { type: 'string' } },
            confidence: { type: 'number' }
          }
        }
      });

      setShiftPlan(result);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      await base44.entities.AdvancedShiftPlan.create({
        driver_email: driverEmail,
        shift_date: tomorrow.toISOString().split('T')[0],
        recommended_start_time: result.recommended_start,
        recommended_end_time: result.recommended_end,
        predicted_earnings: result.predicted_earnings,
        predicted_rides: result.predicted_rides,
        optimal_zones: result.optimal_zones,
        confidence_score: result.confidence
      });
    };

    optimizeShift();
  }, [driverEmail]);

  if (!shiftPlan) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-blue-600" />
            AI Shift Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-2">
              <p className="text-xs text-gray-600">Start</p>
              <p className="font-bold text-blue-600">{shiftPlan.recommended_start}</p>
            </div>
            <div className="bg-white rounded-lg p-2">
              <p className="text-xs text-gray-600">End</p>
              <p className="font-bold text-blue-600">{shiftPlan.recommended_end}</p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Expected Earnings</span>
              <span className="text-lg font-bold text-green-700">${shiftPlan.predicted_earnings}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">~{shiftPlan.predicted_rides} rides</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-2">Hot Zones:</p>
            <div className="flex flex-wrap gap-1">
              {shiftPlan.optimal_zones?.map((zone, idx) => (
                <Badge key={idx} className="bg-orange-600 text-white text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  {zone}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}