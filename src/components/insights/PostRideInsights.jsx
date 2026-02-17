import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Leaf, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PostRideInsights({ rideRequest, userEmail }) {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const generateInsights = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate post-ride insights.

Route: ${rideRequest.pickup_location} to ${rideRequest.dropoff_location}
Fare: $${rideRequest.estimated_price}

Calculate:
1. Carbon footprint in kg
2. Money saved vs traditional taxi
3. Route quality score (0-100)
4. Suggestions for future rides`,
        response_json_schema: {
          type: 'object',
          properties: {
            carbon_kg: { type: 'number' },
            money_saved: { type: 'number' },
            route_score: { type: 'number' },
            suggestions: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setInsights(result);

      await base44.entities.PostRideInsight.create({
        ride_request_id: rideRequest.id,
        passenger_email: userEmail,
        carbon_footprint_kg: result.carbon_kg,
        money_saved_vs_taxi: result.money_saved,
        route_quality_score: result.route_score,
        suggestions: result.suggestions
      });
    };

    generateInsights();
  }, [rideRequest, userEmail]);

  if (!insights) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-600" />
            Ride Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-lg p-2 text-center">
              <Leaf className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Carbon</p>
              <p className="font-bold text-green-700">{insights.carbon_kg}kg</p>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <DollarSign className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Saved</p>
              <p className="font-bold text-blue-700">${insights.money_saved}</p>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <p className="text-xs text-gray-600">Route</p>
              <Badge className="bg-indigo-600 text-white">{insights.route_score}/100</Badge>
            </div>
          </div>

          {insights.suggestions?.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-xs font-semibold text-blue-800 mb-1">💡 Tips</p>
              {insights.suggestions.map((s, idx) => (
                <p key={idx} className="text-xs text-blue-700">{s}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}