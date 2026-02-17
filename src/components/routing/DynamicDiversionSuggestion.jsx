import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation, AlertCircle } from 'lucide-react';

export default function DynamicDiversionSuggestion({ rideRequest }) {
  const [diversion, setDiversion] = useState(null);

  useEffect(() => {
    const checkDiversion = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Check if route diversion needed.

Current route: ${rideRequest.pickup_location} to ${rideRequest.dropoff_location}
Time: ${new Date().toLocaleTimeString()}

Simulate traffic check and suggest alternative if faster.`,
        response_json_schema: {
          type: 'object',
          properties: {
            needs_diversion: { type: 'boolean' },
            alt_route: { type: 'string' },
            time_saved: { type: 'number' },
            fare_adjustment: { type: 'number' },
            reason: { type: 'string' }
          }
        }
      });

      if (result.needs_diversion) {
        setDiversion(result);
      }
    };

    checkDiversion();
  }, [rideRequest]);

  const acceptDiversion = async () => {
    await base44.entities.DynamicRouteDiversion.create({
      ride_request_id: rideRequest.id,
      original_route: `${rideRequest.pickup_location} to ${rideRequest.dropoff_location}`,
      suggested_route: diversion.alt_route,
      reason: diversion.reason,
      time_saved_minutes: diversion.time_saved,
      fare_adjustment: diversion.fare_adjustment,
      accepted: true
    });
    setDiversion(null);
  };

  if (!diversion) return null;

  return (
    <Card className="border-2 border-orange-200 bg-orange-50">
      <CardContent className="p-3">
        <div className="flex items-start gap-2 mb-3">
          <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-orange-900">Faster Route Available</p>
            <p className="text-xs text-gray-700 mt-1">{diversion.reason}</p>
            <p className="text-xs text-green-700 mt-1">Save {diversion.time_saved} minutes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={acceptDiversion} className="flex-1">
            <Navigation className="w-3 h-3 mr-1" />
            Use New Route
          </Button>
          <Button size="sm" variant="outline" onClick={() => setDiversion(null)} className="flex-1">
            Keep Original
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}