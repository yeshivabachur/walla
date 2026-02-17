import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from 'lucide-react';

export default function RideZoneMonitor({ zoneName }) {
  const { data: zone } = useQuery({
    queryKey: ['rideZone', zoneName],
    queryFn: async () => {
      const data = await base44.entities.RideZone.filter({ zone_name: zoneName });
      return data[0];
    }
  });

  if (!zone) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-indigo-600" />
          Zone Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div>
            <p className="text-lg font-bold">{zone.active_drivers}</p>
            <p className="text-xs text-gray-600">Drivers</p>
          </div>
          <div>
            <p className="text-lg font-bold">{zone.pending_requests}</p>
            <p className="text-xs text-gray-600">Requests</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}