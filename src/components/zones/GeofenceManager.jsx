import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from 'lucide-react';

export default function GeofenceManager() {
  const { data: zones = [] } = useQuery({
    queryKey: ['geofenceZones'],
    queryFn: () => base44.entities.GeofenceZone.filter({ active: true })
  });

  const typeColors = {
    pricing: 'bg-green-600',
    restricted: 'bg-red-600',
    priority: 'bg-blue-600',
    event: 'bg-purple-600'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-indigo-600" />
          Active Zones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {zones.map(zone => (
          <div key={zone.id} className="bg-gray-50 rounded-lg p-2 flex items-center justify-between">
            <span className="text-sm font-semibold">{zone.zone_name}</span>
            <Badge className={`${typeColors[zone.zone_type]} text-white text-xs`}>
              {zone.zone_type}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}