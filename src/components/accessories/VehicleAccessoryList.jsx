import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from 'lucide-react';

export default function VehicleAccessoryList({ vehicleId }) {
  const { data: accessories = [] } = useQuery({
    queryKey: ['vehicleAccessories', vehicleId],
    queryFn: () => base44.entities.VehicleAccessory.filter({ vehicle_id: vehicleId, available: true })
  });

  if (accessories.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Vehicle Amenities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {accessories.map(acc => (
            <Badge key={acc.id} variant="outline" className="capitalize">
              {acc.accessory_type.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}