import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

export default function SilentRideModeToggle({ rideRequestId, passengerEmail }) {
  const [preferences, setPreferences] = useState({
    noConversation: true,
    noPhoneCalls: true,
    noRadio: true
  });

  const enableMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.SilentRideMode.create({
        ride_request_id: rideRequestId,
        passenger_email: passengerEmail,
        enabled: true,
        no_conversation: preferences.noConversation,
        no_phone_calls: preferences.noPhoneCalls,
        no_radio: preferences.noRadio,
        driver_notified: true
      });
    },
    onSuccess: () => {
      toast.success('Silent mode activated - driver notified');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <VolumeX className="w-4 h-4 text-gray-600" />
          Silent Ride Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={preferences.noConversation}
              onCheckedChange={(v) => setPreferences({...preferences, noConversation: v})}
            />
            <label className="text-sm">No conversation</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={preferences.noPhoneCalls}
              onCheckedChange={(v) => setPreferences({...preferences, noPhoneCalls: v})}
            />
            <label className="text-sm">No phone calls</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={preferences.noRadio}
              onCheckedChange={(v) => setPreferences({...preferences, noRadio: v})}
            />
            <label className="text-sm">No radio/music</label>
          </div>
        </div>
        <Button onClick={() => enableMutation.mutate()} className="w-full" size="sm">
          Enable Silent Mode
        </Button>
      </CardContent>
    </Card>
  );
}