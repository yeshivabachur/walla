import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car } from 'lucide-react';
import { toast } from 'sonner';

export default function VehiclePreferenceManager({ userEmail }) {
  const [vehicleType, setVehicleType] = useState('economy');
  const [musicVolume, setMusicVolume] = useState('low');

  const savePreferences = async () => {
    await base44.entities.VehiclePreference.create({
      user_email: userEmail,
      preferred_vehicle_type: vehicleType,
      music_volume: musicVolume,
      temperature_preference: 72
    });
    toast.success('Preferences saved');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Car className="w-4 h-4 text-indigo-600" />
          Vehicle Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-gray-600 mb-2">Vehicle Type</p>
          <Select value={vehicleType} onValueChange={setVehicleType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="comfort">Comfort</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-2">Music Volume</p>
          <Select value={musicVolume} onValueChange={setMusicVolume}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="off">Off</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={savePreferences} className="w-full">
          Save
        </Button>
      </CardContent>
    </Card>
  );
}