import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

export default function DriverZonePreferenceManager({ driverEmail }) {
  const [preferredZone, setPreferredZone] = useState('');
  const [avoidZone, setAvoidZone] = useState('');
  const [preferences, setPreferences] = useState({ preferred: [], avoid: [] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.DriverZonePreference.create({
        driver_email: driverEmail,
        preferred_zones: preferences.preferred,
        avoid_zones: preferences.avoid,
        auto_decline_outside_zones: false
      });
    },
    onSuccess: () => {
      toast.success('Zone preferences saved');
    }
  });

  const addPreferred = () => {
    if (preferredZone) {
      setPreferences(p => ({ ...p, preferred: [...p.preferred, preferredZone] }));
      setPreferredZone('');
    }
  };

  const addAvoid = () => {
    if (avoidZone) {
      setPreferences(p => ({ ...p, avoid: [...p.avoid, avoidZone] }));
      setAvoidZone('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-blue-600" />
          Zone Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Preferred Zones</p>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add zone"
              value={preferredZone}
              onChange={(e) => setPreferredZone(e.target.value)}
              size="sm"
            />
            <Button onClick={addPreferred} size="sm">Add</Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {preferences.preferred.map((z, i) => (
              <Badge key={i} className="bg-green-500">{z}</Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-600 mb-1">Avoid Zones</p>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add zone"
              value={avoidZone}
              onChange={(e) => setAvoidZone(e.target.value)}
              size="sm"
            />
            <Button onClick={addAvoid} size="sm">Add</Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {preferences.avoid.map((z, i) => (
              <Badge key={i} className="bg-red-500">{z}</Badge>
            ))}
          </div>
        </div>

        <Button onClick={() => saveMutation.mutate()} className="w-full" size="sm">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}