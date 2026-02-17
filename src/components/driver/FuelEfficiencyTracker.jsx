import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fuel, TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FuelEfficiencyTracker({ driverEmail, vehicleId }) {
  const [efficiency, setEfficiency] = useState(null);

  useEffect(() => {
    const analyzeEfficiency = async () => {
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyze fuel efficiency for ride-share driver.

Vehicle: ${vehicleId}
Average city driving patterns
Recent trips: mixed urban/highway

Provide:
1. Estimated fuel consumption (L/100km)
2. Cost per kilometer
3. Efficiency rating (0-100)
4. 3 actionable tips to improve efficiency
5. Comparison to average (better/worse/average)`,
          response_json_schema: {
            type: 'object',
            properties: {
              fuel_consumption: { type: 'number' },
              cost_per_km: { type: 'number' },
              efficiency_rating: { type: 'number' },
              tips: { type: 'array', items: { type: 'string' } },
              compared_to_avg: { type: 'string' }
            }
          }
        });

        setEfficiency(result);

        await base44.entities.FuelEfficiency.create({
          driver_email: driverEmail,
          vehicle_id: vehicleId,
          date: new Date().toISOString().split('T')[0],
          total_distance_km: 150,
          fuel_consumed_liters: result.fuel_consumption * 1.5,
          efficiency_rating: result.efficiency_rating,
          cost_per_km: result.cost_per_km,
          ai_tips: result.tips,
          compared_to_avg: result.compared_to_avg
        });
      } catch (error) {
        console.error('Efficiency analysis failed:', error);
      }
    };

    analyzeEfficiency();
  }, [driverEmail, vehicleId]);

  if (!efficiency) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Fuel className="w-5 h-5 text-green-600" />
              Fuel Efficiency
            </span>
            <Badge className={
              efficiency.efficiency_rating > 75 ? 'bg-green-600' : 
              efficiency.efficiency_rating > 50 ? 'bg-yellow-600' : 'bg-red-600'
            }>
              {efficiency.efficiency_rating}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Cost/km</p>
              <p className="text-lg font-bold text-gray-900">
                ${efficiency.cost_per_km.toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">vs Average</p>
              <div className="flex items-center gap-1">
                {efficiency.compared_to_avg === 'better' ? (
                  <TrendingDown className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-600" />
                )}
                <p className="text-sm font-bold text-gray-900">
                  {efficiency.compared_to_avg}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-gray-700">Efficiency Tips</p>
            {efficiency.tips?.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-green-600 text-xs">•</span>
                <p className="text-xs text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}