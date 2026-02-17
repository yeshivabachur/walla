import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function ScheduledRideBooking({ passengerEmail }) {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [datetime, setDatetime] = useState('');
  const queryClient = useQueryClient();

  const scheduleMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.ScheduledRide.create({
        passenger_email: passengerEmail,
        pickup_location: pickup,
        dropoff_location: dropoff,
        scheduled_datetime: datetime,
        status: 'scheduled',
        vehicle_preferences: {},
        ride_preferences: {}
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['scheduledRides']);
      toast.success('Ride scheduled successfully!');
      setPickup('');
      setDropoff('');
      setDatetime('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-blue-600" />
          Schedule Future Ride
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Pickup location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
        <Input
          placeholder="Drop-off location"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
        />
        <Input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
        />
        <Button
          onClick={() => scheduleMutation.mutate()}
          disabled={!pickup || !dropoff || !datetime}
          className="w-full"
        >
          Schedule Ride
        </Button>
      </CardContent>
    </Card>
  );
}