import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Accessibility } from 'lucide-react';
import { toast } from 'sonner';

export default function WheelchairAccessibleRequest({ rideRequestId }) {
  const [wheelchairType, setWheelchairType] = useState('manual');
  const [requiresRamp, setRequiresRamp] = useState(true);
  const [requiresLift, setRequiresLift] = useState(false);

  const requestMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.WheelchairAccessible.create({
        ride_request_id: rideRequestId,
        wheelchair_type: wheelchairType,
        requires_ramp: requiresRamp,
        requires_lift: requiresLift,
        certified_driver_required: true
      });
    },
    onSuccess: () => {
      toast.success('Wheelchair accessible vehicle requested');
    }
  });

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Accessibility className="w-4 h-4 text-blue-600" />
          Wheelchair Accessible Vehicle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={wheelchairType} onValueChange={setWheelchairType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Manual Wheelchair</SelectItem>
            <SelectItem value="electric">Electric Wheelchair</SelectItem>
            <SelectItem value="scooter">Mobility Scooter</SelectItem>
          </SelectContent>
        </Select>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox checked={requiresRamp} onCheckedChange={setRequiresRamp} />
            <label className="text-sm">Requires ramp</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={requiresLift} onCheckedChange={setRequiresLift} />
            <label className="text-sm">Requires power lift</label>
          </div>
        </div>
        <Button onClick={() => requestMutation.mutate()} className="w-full">
          Request Accessible Vehicle
        </Button>
      </CardContent>
    </Card>
  );
}