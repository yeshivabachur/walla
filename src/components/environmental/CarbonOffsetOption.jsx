import React from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function CarbonOffsetOption({ rideRequestId, userEmail, distance }) {
  const [autoOffset, setAutoOffset] = useState(false);
  const carbonKg = (distance * 0.12).toFixed(2);
  const offsetCost = (carbonKg * 0.015).toFixed(2);

  const offsetMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.CarbonOffset.create({
        user_email: userEmail,
        ride_request_id: rideRequestId,
        carbon_emissions_kg: parseFloat(carbonKg),
        offset_cost: parseFloat(offsetCost),
        offset_project: 'Reforestation Initiative',
        offset_purchased: true
      });
    },
    onSuccess: () => {
      toast.success('Carbon offset purchased! 🌱');
    }
  });

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Leaf className="w-4 h-4 text-green-600" />
          Carbon Offset
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-white rounded p-2">
          <p className="text-xs text-gray-600">Estimated emissions</p>
          <p className="text-lg font-bold text-green-600">{carbonKg} kg CO₂</p>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox checked={autoOffset} onCheckedChange={setAutoOffset} />
          <label className="text-xs">Auto-offset all rides</label>
        </div>
        <Button onClick={() => offsetMutation.mutate()} className="w-full bg-green-600 hover:bg-green-700" size="sm">
          Offset for ${offsetCost}
        </Button>
        <p className="text-xs text-gray-600">Supports reforestation projects</p>
      </CardContent>
    </Card>
  );
}