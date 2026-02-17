import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Navigation } from 'lucide-react';

export default function DriverAvailabilityToggle({ driverEmail, currentLocation }) {
  const [isAvailable, setIsAvailable] = useState(false);

  const updateAvailability = async (available) => {
    setIsAvailable(available);
    
    await base44.entities.DriverAvailability.create({
      driver_email: driverEmail,
      is_online: available,
      current_location: currentLocation,
      last_ping: new Date().toISOString(),
      accepting_rides: available
    });
  };

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-green-600" />
            <Label className="text-sm font-semibold">Available for Rides</Label>
          </div>
          <Switch checked={isAvailable} onCheckedChange={updateAvailability} />
        </div>
      </CardContent>
    </Card>
  );
}