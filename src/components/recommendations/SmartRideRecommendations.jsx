import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SmartRideRecommendations({ passengerEmail }) {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const getRecommendations = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Suggest optimal rides for passenger.

Passenger: ${passengerEmail}
Time: ${new Date().toLocaleTimeString()}

Based on typical patterns, suggest 2 rides with:
1. Recommended route
2. Best time to book
3. Estimated savings`,
        response_json_schema: {
          type: 'object',
          properties: {
            recommendations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  route: { type: 'string' },
                  reason: { type: 'string' },
                  best_time: { type: 'string' },
                  savings: { type: 'number' }
                }
              }
            }
          }
        }
      });

      setRecommendations(result.recommendations || []);

      for (const r of result.recommendations || []) {
        await base44.entities.RideRecommendation.create({
          passenger_email: passengerEmail,
          recommended_route: r.route,
          reason: r.reason,
          confidence: 0.85,
          best_time: r.best_time,
          estimated_savings: r.savings
        });
      }
    };

    getRecommendations();
  }, [passengerEmail]);

  if (recommendations.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Lightbulb className="w-4 h-4 text-yellow-600" />
          Recommended Rides
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="bg-yellow-50 rounded-lg p-2 border border-yellow-200">
            <p className="text-sm font-semibold">{rec.route}</p>
            <p className="text-xs text-gray-600 mt-1">{rec.reason}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-green-600">Save ${rec.savings}</span>
              <Button size="sm" variant="outline" onClick={() => navigate(createPageUrl('RequestRide'))}>
                Book
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}