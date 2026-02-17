import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function SOSEmergencyButton({ rideRequestId, userEmail }) {
  const [pressed, setPressed] = useState(false);

  const sosMutation = useMutation({
    mutationFn: async (emergencyType) => {
      const position = await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(resolve);
      });

      return await base44.entities.SOSEmergency.create({
        ride_request_id: rideRequestId,
        triggered_by: userEmail,
        trigger_time: new Date().toISOString(),
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        emergency_type: emergencyType,
        status: 'active',
        authorities_contacted: true
      });
    },
    onSuccess: () => {
      setPressed(true);
      toast.error('Emergency services contacted! Help is on the way.');
    }
  });

  return (
    <Card className={`border-4 ${pressed ? 'border-red-600 bg-red-100' : 'border-red-400 bg-red-50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-red-600">
          <AlertTriangle className="w-5 h-5" />
          Emergency SOS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-gray-700">Press for immediate emergency assistance</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => sosMutation.mutate('medical')}
            className="bg-red-600 hover:bg-red-700"
            disabled={pressed}
          >
            <Phone className="w-4 h-4 mr-2" />
            Medical
          </Button>
          <Button
            onClick={() => sosMutation.mutate('safety')}
            className="bg-red-600 hover:bg-red-700"
            disabled={pressed}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Safety
          </Button>
          <Button
            onClick={() => sosMutation.mutate('accident')}
            className="bg-red-600 hover:bg-red-700"
            disabled={pressed}
          >
            Accident
          </Button>
          <Button
            onClick={() => sosMutation.mutate('other')}
            className="bg-red-600 hover:bg-red-700"
            disabled={pressed}
          >
            Other
          </Button>
        </div>
        {pressed && (
          <p className="text-xs text-red-700 font-bold animate-pulse">
            Emergency response activated
          </p>
        )}
      </CardContent>
    </Card>
  );
}