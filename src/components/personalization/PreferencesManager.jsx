import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Car, Music, Thermometer, Volume2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function PreferencesManager({ userEmail }) {
  const queryClient = useQueryClient();
  const [preferences, setPreferences] = useState({
    preferred_vehicle_types: [],
    ride_preferences: {
      quiet_ride: false,
      temperature_preference: 'no_preference',
      music_preference: 'no_preference'
    }
  });

  // Fetch existing preferences
  const { data: existingPrefs } = useQuery({
    queryKey: ['preferences', userEmail],
    queryFn: async () => {
      const prefs = await base44.entities.PassengerPreferences.filter({ passenger_email: userEmail });
      if (prefs[0]) {
        setPreferences(prefs[0]);
      }
      return prefs[0];
    },
    enabled: !!userEmail
  });

  const savePreferencesMutation = useMutation({
    mutationFn: async () => {
      if (existingPrefs) {
        await base44.entities.PassengerPreferences.update(existingPrefs.id, preferences);
      } else {
        await base44.entities.PassengerPreferences.create({
          passenger_email: userEmail,
          ...preferences
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['preferences']);
      toast.success('Preferences saved!');
    }
  });

  const vehicleTypes = ['Sedan', 'SUV', 'Electric', 'Luxury', 'Compact'];

  const toggleVehicleType = (type) => {
    setPreferences(prev => ({
      ...prev,
      preferred_vehicle_types: prev.preferred_vehicle_types.includes(type)
        ? prev.preferred_vehicle_types.filter(t => t !== type)
        : [...prev.preferred_vehicle_types, type]
    }));
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          Ride Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vehicle Types */}
        <div>
          <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Car className="w-4 h-4" />
            Preferred Vehicle Types
          </Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {vehicleTypes.map(type => (
              <Badge
                key={type}
                onClick={() => toggleVehicleType(type)}
                className={`cursor-pointer ${
                  preferences.preferred_vehicle_types.includes(type)
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Ride Preferences */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-500" />
              <Label>Quiet Ride</Label>
            </div>
            <Switch
              checked={preferences.ride_preferences.quiet_ride}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({
                  ...prev,
                  ride_preferences: { ...prev.ride_preferences, quiet_ride: checked }
                }))
              }
            />
          </div>

          <div>
            <Label className="text-sm flex items-center gap-2 mb-2">
              <Thermometer className="w-4 h-4 text-gray-500" />
              Temperature Preference
            </Label>
            <div className="flex gap-2">
              {['cool', 'warm', 'no_preference'].map(temp => (
                <Button
                  key={temp}
                  variant="outline"
                  size="sm"
                  onClick={() => 
                    setPreferences(prev => ({
                      ...prev,
                      ride_preferences: { ...prev.ride_preferences, temperature_preference: temp }
                    }))
                  }
                  className={
                    preferences.ride_preferences.temperature_preference === temp
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : ''
                  }
                >
                  {temp === 'no_preference' ? 'Any' : temp.charAt(0).toUpperCase() + temp.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm flex items-center gap-2 mb-2">
              <Music className="w-4 h-4 text-gray-500" />
              Music Preference
            </Label>
            <div className="flex gap-2">
              {['none', 'low', 'no_preference'].map(music => (
                <Button
                  key={music}
                  variant="outline"
                  size="sm"
                  onClick={() => 
                    setPreferences(prev => ({
                      ...prev,
                      ride_preferences: { ...prev.ride_preferences, music_preference: music }
                    }))
                  }
                  className={
                    preferences.ride_preferences.music_preference === music
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : ''
                  }
                >
                  {music === 'no_preference' ? 'Any' : music.charAt(0).toUpperCase() + music.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={() => savePreferencesMutation.mutate()}
          disabled={savePreferencesMutation.isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}