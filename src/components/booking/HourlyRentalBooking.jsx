import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function HourlyRentalBooking({ passengerEmail }) {
  const [pickup, setPickup] = useState('');
  const [startTime, setStartTime] = useState('');
  const [hours, setHours] = useState(2);

  const hourlyRate = 35;

  const bookMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.HourlyRental.create({
        passenger_email: passengerEmail,
        start_time: startTime,
        duration_hours: hours,
        hourly_rate: hourlyRate,
        total_cost: hourlyRate * hours,
        pickup_location: pickup,
        destinations: [],
        status: 'pending'
      });
    },
    onSuccess: () => {
      toast.success(`Hourly rental booked for ${hours} hours`);
      setPickup('');
      setStartTime('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-purple-600" />
          Hourly Rental - Book a Driver
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Pickup location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
        <Input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <div>
          <label className="text-sm text-gray-600">Duration (hours)</label>
          <Input
            type="number"
            min="1"
            max="12"
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value))}
          />
        </div>
        <div className="bg-purple-50 rounded p-3">
          <p className="text-xs text-gray-600">Total Cost</p>
          <p className="text-2xl font-bold text-purple-600">${hourlyRate * hours}</p>
          <p className="text-xs text-gray-600">${hourlyRate}/hour × {hours} hours</p>
        </div>
        <Button onClick={() => bookMutation.mutate()} disabled={!pickup || !startTime} className="w-full">
          Book Hourly Rental
        </Button>
      </CardContent>
    </Card>
  );
}