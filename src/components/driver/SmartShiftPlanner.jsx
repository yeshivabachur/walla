import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, TrendingUp, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function SmartShiftPlanner({ driverEmail }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate optimal shift plan for ride-share driver.

Current date: ${new Date().toLocaleDateString()}
Day of week: ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}

Analyze:
- Peak demand times for the day
- High-earning zones
- Suggested break times
- Expected earnings

Provide recommendations for 3 time zones during the shift.`,
        response_json_schema: {
          type: 'object',
          properties: {
            recommended_start: { type: 'string' },
            recommended_end: { type: 'string' },
            predicted_earnings: { type: 'number' },
            zones: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  zone: { type: 'string' },
                  time: { type: 'string' },
                  expected_demand: { type: 'string' },
                  potential_earnings: { type: 'number' }
                }
              }
            },
            break_times: { type: 'array', items: { type: 'string' } },
            suggestions: { type: 'string' }
          }
        }
      });

      setPlan(result);

      await base44.entities.DriverShiftPlan.create({
        driver_email: driverEmail,
        shift_date: new Date().toISOString().split('T')[0],
        start_time: result.recommended_start,
        end_time: result.recommended_end,
        recommended_zones: result.zones,
        predicted_earnings: result.predicted_earnings,
        break_times: result.break_times,
        ai_suggestions: result.suggestions
      });

      toast.success('Shift plan generated!');
    } catch (error) {
      console.error('Failed to generate plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Smart Shift Planner
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!plan ? (
          <Button
            onClick={generatePlan}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Analyzing...' : 'Generate Today\'s Plan'}
          </Button>
        ) : (
          <>
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Recommended Shift
                </span>
                <Badge className="bg-green-600 text-white">
                  ${plan.predicted_earnings}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {plan.recommended_start} - {plan.recommended_end}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">High-Demand Zones</p>
              {plan.zones?.map((zone, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-lg p-3"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold">{zone.zone}</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      +${zone.potential_earnings}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 ml-6">
                    {zone.time} • {zone.expected_demand} demand
                  </div>
                </motion.div>
              ))}
            </div>

            {plan.break_times?.length > 0 && (
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <p className="text-xs font-semibold text-yellow-800 mb-1">
                  Suggested Breaks
                </p>
                <p className="text-xs text-yellow-700">
                  {plan.break_times.join(', ')}
                </p>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-xs font-semibold text-blue-800 mb-1">
                AI Suggestions
              </p>
              <p className="text-xs text-blue-700">{plan.suggestions}</p>
            </div>

            <Button
              onClick={generatePlan}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Regenerate Plan
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}