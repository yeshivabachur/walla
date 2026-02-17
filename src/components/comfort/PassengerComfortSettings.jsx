import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Thermometer } from 'lucide-react';
import { toast } from 'sonner';

export default function PassengerComfortSettings({ passengerEmail }) {
  const [temperature, setTemperature] = useState(22);
  const [windowPref, setWindowPref] = useState('closed');

  const saveMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.PassengerComfort.create({
        passenger_email: passengerEmail,
        preferred_temperature_celsius: temperature,
        window_preference: windowPref,
        ride_smoothness_priority: true
      });
    },
    onSuccess: () => {
      toast.success('Comfort settings saved');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Thermometer className="w-4 h-4 text-blue-600" />
          Comfort Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="text-xs text-gray-600">Temperature: {temperature}°C</label>
          <input
            type="range"
            min="18"
            max="26"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Window</label>
          <Select value={windowPref} onValueChange={setWindowPref}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="no_preference">No Preference</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => saveMutation.mutate()} className="w-full" size="sm">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}