import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function AutoCheckInSystem({ rideRequest, userEmail }) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Trigger check-in for rides over 20 minutes
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 20 * 60 * 1000); // 20 minutes

    return () => clearTimeout(timer);
  }, []);

  const respondCheckIn = async (status) => {
    await base44.entities.RideCheckIn.create({
      ride_request_id: rideRequest.id,
      user_email: userEmail,
      check_in_time: new Date().toISOString(),
      status: status,
      location: rideRequest.current_location,
      response_required: status !== 'safe'
    });

    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <p className="text-sm font-semibold mb-3">Safety Check-In</p>
        <p className="text-xs text-gray-700 mb-3">Is everything okay?</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => respondCheckIn('safe')}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            All Good
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => respondCheckIn('needs_attention')}
            className="flex-1"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Need Help
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}