import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from 'lucide-react';
import { toast } from 'sonner';

export default function RideForOthersForm({ bookerEmail, onBooked }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('');

  const bookMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.BookingForOthers.create({
        booker_email: bookerEmail,
        passenger_name: name,
        passenger_phone: phone,
        passenger_email: email,
        relationship
      });
    },
    onSuccess: (data) => {
      toast.success('Ride booked for ' + name);
      onBooked?.(data);
      setName('');
      setPhone('');
      setEmail('');
      setRelationship('');
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
      <CardContent className="space-y-3">
        <Input
          placeholder="Passenger name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Passenger phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          placeholder="Passenger email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Relationship (e.g., spouse, parent)"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
        />
        <Button
          onClick={() => bookMutation.mutate()}
          disabled={!name || !phone}
          className="w-full"
        >
          Book for {name || 'Passenger'}
        </Button>
      </CardContent>
    </Card>
  );
}