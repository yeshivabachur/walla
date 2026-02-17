import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from 'lucide-react';

export default function PassengerBehaviorAnalyzer({ passengerEmail }) {
  const [behavior, setBehavior] = useState(null);

  useEffect(() => {
    const analyze = async () => {
      const rides = await base44.entities.RideRequest.filter({ passenger_email: passengerEmail });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze passenger behavior.

Total rides: ${rides.length}
Passenger: ${passengerEmail}

Identify:
1. Typical routes (2-3)
2. Preferred times
3. Average spending
4. Booking patterns`,
        response_json_schema: {
          type: 'object',
          properties: {
            routes: { type: 'array', items: { type: 'string' } },
            times: { type: 'array', items: { type: 'string' } },
            avg_spending: { type: 'number' },
            pattern: { type: 'string' }
          }
        }
      });

      setBehavior(result);

      await base44.entities.PassengerBehavior.create({
        passenger_email: passengerEmail,
        typical_routes: result.routes,
        preferred_times: result.times,
        average_trip_duration: 25,
        typical_spending: result.avg_spending,
        booking_patterns: result.pattern
      });
    };

    analyze();
  }, [passengerEmail]);

  if (!behavior) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <BarChart3 className="w-4 h-4 text-purple-600" />
          Your Patterns
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-xs font-semibold mb-1">Common Routes:</p>
          {behavior.routes?.map((r, idx) => (
            <p key={idx} className="text-xs text-gray-700">• {r}</p>
          ))}
        </div>
        <div>
          <p className="text-xs font-semibold mb-1">Preferred Times:</p>
          {behavior.times?.map((t, idx) => (
            <p key={idx} className="text-xs text-gray-700">• {t}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}