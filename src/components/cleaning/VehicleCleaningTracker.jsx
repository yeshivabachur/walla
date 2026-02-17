import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';

export default function VehicleCleaningTracker({ vehicleId }) {
  const { data: cleanings = [] } = useQuery({
    queryKey: ['vehicleCleanings', vehicleId],
    queryFn: () => base44.entities.VehicleCleaning.filter({ vehicle_id: vehicleId })
  });

  const latest = cleanings[0];

  if (!latest) return null;

  return (
    <Card className="border-2 border-cyan-200 bg-cyan-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-cyan-600" />
          Vehicle Cleaning
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-1">Last cleaned: {new Date(latest.cleaning_date).toLocaleDateString()}</p>
        {latest.next_cleaning_due && (
          <p className="text-xs text-gray-600">Next due: {new Date(latest.next_cleaning_due).toLocaleDateString()}</p>
        )}
      </CardContent>
    </Card>
  );
}