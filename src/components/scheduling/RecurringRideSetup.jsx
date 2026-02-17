import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Repeat } from 'lucide-react';
import { toast } from 'sonner';

export default function RecurringRideSetup({ passengerEmail }) {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pattern, setPattern] = useState('daily');
  const [time, setTime] = useState('');
  const [days, setDays] = useState([]);
  const queryClient = useQueryClient();

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day) => {
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const recurringMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.RecurringRide.create({
        passenger_email: passengerEmail,
        pickup_location: pickup,
        dropoff_location: dropoff,
        recurrence_pattern: pattern,
        time_of_day: time,
        days_of_week: pattern === 'custom' ? days : [],
        start_date: new Date().toISOString().split('T')[0],
        active: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['recurringRides']);
      toast.success('Recurring ride setup complete!');
      setPickup('');
      setDropoff('');
      setTime('');
      setDays([]);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Repeat className="w-4 h-4 text-purple-600" />
          Setup Recurring Ride
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
        <Select value={pattern} onValueChange={setPattern}>
          <SelectTrigger>
            <SelectValue placeholder="Select pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekdays">Weekdays Only</SelectItem>
            <SelectItem value="weekends">Weekends Only</SelectItem>
            <SelectItem value="custom">Custom Days</SelectItem>
          </SelectContent>
        </Select>
        {pattern === 'custom' && (
          <div className="space-y-2">
            {weekDays.map(day => (
              <div key={day} className="flex items-center gap-2">
                <Checkbox
                  checked={days.includes(day)}
                  onCheckedChange={() => toggleDay(day)}
                />
                <label className="text-sm">{day}</label>
              </div>
            ))}
          </div>
        )}
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <Button
          onClick={() => recurringMutation.mutate()}
          disabled={!pickup || !dropoff || !time}
          className="w-full"
        >
          Setup Recurring Ride
        </Button>
      </CardContent>
    </Card>
  );
}