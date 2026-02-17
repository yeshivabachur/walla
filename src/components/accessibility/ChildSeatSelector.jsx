import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Baby } from 'lucide-react';
import { toast } from 'sonner';

export default function ChildSeatSelector({ rideRequestId }) {
  const [seatType, setSeatType] = useState('booster');
  const [childAge, setChildAge] = useState('');
  const [quantity, setQuantity] = useState(1);

  const requestMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.ChildSeatRequest.create({
        ride_request_id: rideRequestId,
        seat_type: seatType,
        child_age: parseInt(childAge),
        quantity,
        additional_fee: 10 * quantity
      });
    },
    onSuccess: () => {
      toast.success(`${quantity} child seat(s) requested`);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Baby className="w-4 h-4 text-pink-600" />
          Child Seat Request (+$10 each)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={seatType} onValueChange={setSeatType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="infant">Infant Seat (0-12 months)</SelectItem>
            <SelectItem value="convertible">Convertible (0-4 years)</SelectItem>
            <SelectItem value="booster">Booster (4-12 years)</SelectItem>
            <SelectItem value="all-in-one">All-in-One</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Child age (years)"
          value={childAge}
          onChange={(e) => setChildAge(e.target.value)}
        />
        <div>
          <label className="text-xs text-gray-600">Quantity</label>
          <Input
            type="number"
            min="1"
            max="4"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>
        <Button onClick={() => requestMutation.mutate()} disabled={!childAge} className="w-full" size="sm">
          Request Child Seat(s) - ${10 * quantity}
        </Button>
      </CardContent>
    </Card>
  );
}