import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IdleTimeOptimizer({ driverEmail, currentLocation }) {
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    const optimize = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Suggest optimal waiting spot for driver.

Current location: ${currentLocation}
Time: ${new Date().toLocaleTimeString()}

Consider:
1. Nearby demand patterns
2. Competitor density
3. Optimal parking spots
4. Expected wait time

Provide specific location suggestion.`,
        response_json_schema: {
          type: 'object',
          properties: {
            location: { type: 'string' },
            wait_time: { type: 'number' },
            reason: { type: 'string' },
            demand_score: { type: 'number' }
          }
        }
      });

      setSuggestion(result);

      await base44.entities.IdleTimeOptimization.create({
        driver_email: driverEmail,
        current_location: currentLocation,
        suggested_waiting_spot: result.location,
        expected_wait_minutes: result.wait_time,
        reasoning: result.reason,
        nearby_demand_score: result.demand_score
      });
    };

    optimize();
  }, [driverEmail, currentLocation]);

  if (!suggestion) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border-2 border-cyan-200 bg-cyan-50">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-cyan-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-cyan-900">Optimal Waiting Spot</p>
              <p className="text-sm font-bold text-cyan-700 mt-1">{suggestion.location}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600">~{suggestion.wait_time} min wait</span>
              </div>
              <p className="text-xs text-gray-700 mt-1">{suggestion.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}