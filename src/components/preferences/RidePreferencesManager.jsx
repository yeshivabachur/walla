import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Volume, Thermometer, MessageCircle, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function RidePreferencesManager({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: prefs } = useQuery({
    queryKey: ['ridePreferences', userEmail],
    queryFn: async () => {
      const preferences = await base44.entities.RidePreferences.filter({ user_email: userEmail });
      return preferences[0];
    },
    enabled: !!userEmail
  });

  const [localPrefs, setLocalPrefs] = useState(prefs || {
    temperature_preference: 'moderate',
    music_preference: 'driver_choice',
    conversation_preference: 'moderate',
    pet_friendly: false,
    child_seat_needed: false
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (prefs) {
        await base44.entities.RidePreferences.update(prefs.id, localPrefs);
      } else {
        await base44.entities.RidePreferences.create({
          user_email: userEmail,
          ...localPrefs
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ridePreferences']);
      toast.success('Ride preferences saved!');
    }
  });

  React.useEffect(() => {
    if (prefs) setLocalPrefs(prefs);
  }, [prefs]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Ride Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Thermometer className="w-4 h-4" />
                Temperature
              </Label>
              <Select
                value={localPrefs.temperature_preference}
                onValueChange={(v) => setLocalPrefs({...localPrefs, temperature_preference: v})}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cool">❄️ Cool</SelectItem>
                  <SelectItem value="moderate">🌡️ Moderate</SelectItem>
                  <SelectItem value="warm">🔥 Warm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Volume className="w-4 h-4" />
                Music
              </Label>
              <Select
                value={localPrefs.music_preference}
                onValueChange={(v) => setLocalPrefs({...localPrefs, music_preference: v})}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_music">🔇 No Music</SelectItem>
                  <SelectItem value="radio">📻 Radio</SelectItem>
                  <SelectItem value="passenger_choice">🎵 My Choice</SelectItem>
                  <SelectItem value="driver_choice">🎧 Driver's Choice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4" />
                Conversation
              </Label>
              <Select
                value={localPrefs.conversation_preference}
                onValueChange={(v) => setLocalPrefs({...localPrefs, conversation_preference: v})}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiet">🤫 Quiet Ride</SelectItem>
                  <SelectItem value="moderate">💬 Moderate</SelectItem>
                  <SelectItem value="chatty">😊 Chatty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <PawPrint className="w-4 h-4" />
                Pet-Friendly Rides
              </Label>
              <Switch
                checked={localPrefs.pet_friendly}
                onCheckedChange={(v) => setLocalPrefs({...localPrefs, pet_friendly: v})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Child Seat Required</Label>
              <Switch
                checked={localPrefs.child_seat_needed}
                onCheckedChange={(v) => setLocalPrefs({...localPrefs, child_seat_needed: v})}
              />
            </div>

            {localPrefs.child_seat_needed && (
              <Select
                value={localPrefs.child_seat_type}
                onValueChange={(v) => setLocalPrefs({...localPrefs, child_seat_type: v})}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select child seat type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="infant">👶 Infant Seat</SelectItem>
                  <SelectItem value="toddler">🧒 Toddler Seat</SelectItem>
                  <SelectItem value="booster">👦 Booster Seat</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-12"
          >
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}