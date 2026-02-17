import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';

export default function RoundTripBooking({ passengerEmail }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [outbound, setOutbound] = useState('');
  const [returnTime, setReturnTime] = useState('');

  const roundTripMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.RoundTripBooking.create({
        passenger_email: passengerEmail,
        origin,
        destination,
        outbound_datetime: outbound,
        return_datetime: returnTime,
        discount_applied: 10,
        status: 'scheduled'
      });
    },
    onSuccess: () => {
      toast.success('Round trip booked with 10% discount!');
      setOrigin('');
      setDestination('');
      setOutbound('');
      setReturnTime('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <ArrowLeftRight className="w-4 h-4 text-green-600" />
          Round Trip Booking
          <Badge className="bg-green-600">Save 10%</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Starting location"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <Input
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-600">Outbound</label>
            <Input
              type="datetime-local"
              value={outbound}
              onChange={(e) => setOutbound(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Return</label>
            <Input
              type="datetime-local"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={() => roundTripMutation.mutate()}
          disabled={!origin || !destination || !outbound || !returnTime}
          className="w-full"
        >
          Book Round Trip
        </Button>
      </CardContent>
    </Card>
  );
}