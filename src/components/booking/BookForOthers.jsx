import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from 'lucide-react';
import { toast } from 'sonner';

export default function BookForOthers({ bookerEmail, onBooked }) {
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [relationship, setRelationship] = useState('family');

  const bookMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.BookingForOthers.create({
        booker_email: bookerEmail,
        passenger_name: passengerName,
        passenger_phone: passengerPhone,
        relationship,
        payment_method: 'booker_pays'
      });
    },
    onSuccess: (data) => {
      toast.success(`Booking created for ${passengerName}`);
      onBooked?.(data);
      setPassengerName('');
      setPassengerPhone('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-purple-600" />
          Book Ride for Someone Else
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Input
          placeholder="Passenger name"
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
        />
        <Input
          placeholder="Phone number"
          value={passengerPhone}
          onChange={(e) => setPassengerPhone(e.target.value)}
        />
        <Select value={relationship} onValueChange={setRelationship}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="family">Family</SelectItem>
            <SelectItem value="friend">Friend</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={() => bookMutation.mutate()} 
          disabled={!passengerName || !passengerPhone}
          className="w-full"
          size="sm"
        >
          Continue to Book
        </Button>
      </CardContent>
    </Card>
  );
}