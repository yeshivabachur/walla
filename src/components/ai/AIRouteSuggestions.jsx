import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Navigation } from 'lucide-react';

export default function AIRouteSuggestions({ driverEmail, currentLocation }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const getSuggestions = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Suggest optimal destinations for driver.

Driver: ${driverEmail}
Current location: ${currentLocation}
Time: ${new Date().toLocaleTimeString()}

Analyze demand patterns and suggest 3 destinations with earning potential.`,
        response_json_schema: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  destination: { type: 'string' },
                  earnings: { type: 'number' },
                  probability: { type: 'number' },
                  reason: { type: 'string' }
                }
              }
            }
          }
        }
      });

      setSuggestions(result.suggestions || []);

      for (const s of result.suggestions || []) {
        await base44.entities.AIRouteSuggestion.create({
          driver_email: driverEmail,
          suggested_destination: s.destination,
          expected_earnings: s.earnings,
          probability_score: s.probability,
          reasoning: s.reason,
          time_of_day: new Date().toLocaleTimeString()
        });
      }
    };

    getSuggestions();
  }, [driverEmail, currentLocation]);

  if (suggestions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          AI Route Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.slice(0, 3).map((s, idx) => (
          <div key={idx} className="bg-indigo-50 rounded-lg p-2 border border-indigo-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold">{s.destination}</span>
              <Badge className="bg-green-600 text-white">${s.earnings}</Badge>
            </div>
            <p className="text-xs text-gray-600">{s.reason}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}