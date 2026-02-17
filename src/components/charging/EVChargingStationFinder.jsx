import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from 'lucide-react';

export default function EVChargingStationFinder({ currentLocation }) {
  const { data: stations = [] } = useQuery({
    queryKey: ['evStations', currentLocation],
    queryFn: () => base44.entities.EVChargingStation.list()
  });

  const nearbyStations = stations.filter(s => s.currently_available).slice(0, 3);

  if (nearbyStations.length === 0) return null;

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-green-600" />
          Nearby EV Chargers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {nearbyStations.map(station => (
          <div key={station.id} className="bg-white rounded p-2">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-semibold">{station.station_name}</p>
              <Badge className="bg-green-500">
                {station.available_chargers} available
              </Badge>
            </div>
            <p className="text-xs text-gray-600">
              {station.charger_type.replace('_', ' ')} • ${station.price_per_kwh}/kWh
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}