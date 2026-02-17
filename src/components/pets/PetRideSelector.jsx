import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dog } from 'lucide-react';
import { toast } from 'sonner';

export default function PetRideSelector({ rideRequestId }) {
  const [petType, setPetType] = useState('dog');
  const [size, setSize] = useState('small');
  const [carrier, setCarrier] = useState(true);

  const fee = size === 'large' ? 15 : 10;

  const requestMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.PetFriendlyRide.create({
        ride_request_id: rideRequestId,
        pet_type: petType,
        pet_size: size,
        carrier_required: carrier,
        additional_fee: fee,
        driver_notified: true
      });
    },
    onSuccess: () => {
      toast.success('Pet-friendly ride requested!');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Dog className="w-4 h-4 text-amber-600" />
          Pet-Friendly Ride
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Pet type (e.g., dog, cat)" value={petType} onChange={(e) => setPetType(e.target.value)} />
        <Select value={size} onValueChange={setSize}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small (+$10)</SelectItem>
            <SelectItem value="medium">Medium (+$12)</SelectItem>
            <SelectItem value="large">Large (+$15)</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Checkbox checked={carrier} onCheckedChange={setCarrier} />
          <label className="text-sm">Pet in carrier</label>
        </div>
        <Button onClick={() => requestMutation.mutate()} className="w-full" size="sm">
          Request Pet-Friendly Ride (+${fee})
        </Button>
      </CardContent>
    </Card>
  );
}