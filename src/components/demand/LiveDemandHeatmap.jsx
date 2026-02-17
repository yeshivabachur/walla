import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MapPin } from 'lucide-react';

export default function LiveDemandHeatmap() {
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    const fetchHotspots = async () => {
      const spots = await base44.entities.DemandHotspot.list('-timestamp', 5);
      setHotspots(spots);
    };
    fetchHotspots();
    const interval = setInterval(fetchHotspots, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-2 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-red-600" />
          Live Demand Zones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {hotspots.map(spot => (
          <div key={spot.id} className="bg-white rounded p-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-red-600" />
                <span className="text-xs font-semibold">{spot.zone_name}</span>
              </div>
              <Badge className={
                spot.demand_level === 'extreme' ? 'bg-red-600' :
                spot.demand_level === 'high' ? 'bg-orange-500' :
                spot.demand_level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }>
                {spot.demand_level}
              </Badge>
            </div>
            <div className="text-xs text-gray-600">
              {spot.predicted_surge}x surge • {spot.active_drivers_needed} drivers needed
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}