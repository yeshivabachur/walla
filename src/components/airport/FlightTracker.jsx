import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock } from 'lucide-react';

export default function FlightTracker({ rideRequestId, flightNumber }) {
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    const trackFlight = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Get flight status for ${flightNumber}. Return current status, delays, and estimated arrival.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            delay_minutes: { type: 'number' },
            scheduled_arrival: { type: 'string' },
            actual_arrival: { type: 'string' }
          }
        }
      });

      await base44.entities.FlightTracking.create({
        ride_request_id: rideRequestId,
        flight_number: flightNumber,
        scheduled_arrival: result.scheduled_arrival,
        actual_arrival: result.actual_arrival,
        delay_minutes: result.delay_minutes || 0,
        status: result.status,
        pickup_adjusted: result.delay_minutes > 15
      });

      setTracking(result);
    };

    if (flightNumber) {
      trackFlight();
    }
  }, [flightNumber, rideRequestId]);

  if (!tracking) return null;

  return (
    <Card className="border-2 border-sky-200 bg-sky-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Plane className="w-4 h-4 text-sky-600" />
          Flight Tracking - {flightNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Badge className={
          tracking.status === 'on_time' ? 'bg-green-600' :
          tracking.status === 'delayed' ? 'bg-yellow-600' : 'bg-red-600'
        }>
          {tracking.status}
        </Badge>
        {tracking.delay_minutes > 0 && (
          <div className="flex items-center gap-2 text-xs text-orange-700">
            <Clock className="w-3 h-3" />
            <span>Delayed by {tracking.delay_minutes} minutes</span>
          </div>
        )}
        <p className="text-xs text-gray-600">
          Your driver will be notified of any changes
        </p>
      </CardContent>
    </Card>
  );
}