import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function PreferredZoneSelector({ driverEmail }) {
  const [zoneName, setZoneName] = useState('');
  const queryClient = useQueryClient();

  const { data: zones = [] } = useQuery({
    queryKey: ['preferredZones', driverEmail],
    queryFn: () => base44.entities.PreferredZone.filter({ driver_email: driverEmail, active: true })
  });

  const addZoneMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.PreferredZone.create({
        driver_email: driverEmail,
        zone_name: zoneName,
        priority: zones.length + 1,
        earnings_multiplier: 1.0,
        familiarity_score: 50,
        active: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['preferredZones']);
      toast.success('Preferred zone added');
      setZoneName('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-blue-600" />
          Preferred Zones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {zones.length > 0 && (
          <div className="space-y-1">
            {zones.map(zone => (
              <div key={zone.id} className="bg-blue-50 rounded p-2">
                <p className="text-sm font-semibold">{zone.zone_name}</p>
                <p className="text-xs text-gray-600">Priority: {zone.priority}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <Input
            placeholder="Zone name"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
          />
          <Button onClick={() => addZoneMutation.mutate()} disabled={!zoneName}>
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}