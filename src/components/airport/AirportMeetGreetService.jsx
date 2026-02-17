import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plane } from 'lucide-react';
import { toast } from 'sonner';

export default function AirportMeetGreetService({ rideRequestId, passengerEmail }) {
  const [flightNumber, setFlightNumber] = useState('');
  const [terminal, setTerminal] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [nameSign, setNameSign] = useState(true);
  const [luggage, setLuggage] = useState(false);

  const meetGreetMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.AirportMeetGreet.create({
        ride_request_id: rideRequestId,
        passenger_email: passengerEmail,
        flight_number: flightNumber,
        arrival_time: arrivalTime,
        terminal,
        driver_name_sign: nameSign,
        luggage_assistance: luggage,
        additional_fee: luggage ? 15 : 10,
        status: 'scheduled'
      });
    },
    onSuccess: () => {
      toast.success('Meet & Greet service booked!');
      setFlightNumber('');
      setTerminal('');
      setArrivalTime('');
    }
  });

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Plane className="w-4 h-4 text-blue-600" />
          Airport Meet & Greet Service
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Flight number (e.g., AA1234)"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
        />
        <Input
          placeholder="Terminal (e.g., 1, 2, 3)"
          value={terminal}
          onChange={(e) => setTerminal(e.target.value)}
        />
        <Input
          type="datetime-local"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
        />
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox checked={nameSign} onCheckedChange={setNameSign} />
            <label className="text-sm">Name sign at arrivals (+$10)</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={luggage} onCheckedChange={setLuggage} />
            <label className="text-sm">Luggage assistance (+$15)</label>
          </div>
        </div>

        <div className="bg-white rounded p-2">
          <p className="text-xs text-gray-600">Total Additional Fee</p>
          <p className="text-lg font-bold text-blue-600">${luggage ? 15 : 10}</p>
        </div>

        <Button
          onClick={() => meetGreetMutation.mutate()}
          disabled={!flightNumber || !arrivalTime}
          className="w-full"
        >
          Book Meet & Greet
        </Button>
      </CardContent>
    </Card>
  );
}