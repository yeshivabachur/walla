import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function GroupRideCoordinator({ organizerEmail }) {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [datetime, setDatetime] = useState('');
  const [passengers, setPassengers] = useState([]);
  const [vehicleType, setVehicleType] = useState('van');
  const [newPassenger, setNewPassenger] = useState({ name: '', email: '', phone: '' });

  const addPassenger = () => {
    if (newPassenger.name) {
      setPassengers([...passengers, newPassenger]);
      setNewPassenger({ name: '', email: '', phone: '' });
    }
  };

  const bookMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.GroupRideRequest.create({
        organizer_email: organizerEmail,
        pickup_location: pickup,
        dropoff_location: dropoff,
        scheduled_datetime: datetime,
        total_passengers: passengers.length + 1,
        passenger_list: passengers,
        vehicle_type: vehicleType,
        status: 'pending'
      });
    },
    onSuccess: () => {
      toast.success('Group ride request submitted!');
      setPassengers([]);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-blue-600" />
          Book Group Ride ({passengers.length + 1} people)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} />
        <Input placeholder="Drop-off" value={dropoff} onChange={(e) => setDropoff(e.target.value)} />
        <Input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
        
        <Select value={vehicleType} onValueChange={setVehicleType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="van">Van (7 passengers)</SelectItem>
            <SelectItem value="suv">SUV (6 passengers)</SelectItem>
            <SelectItem value="minibus">Minibus (12 passengers)</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2">
          {passengers.map((p, idx) => (
            <div key={idx} className="flex justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm">{p.name}</span>
              <Button onClick={() => setPassengers(passengers.filter((_, i) => i !== idx))} variant="ghost" size="sm">
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t pt-2 space-y-2">
          <Input placeholder="Passenger name" value={newPassenger.name} 
            onChange={(e) => setNewPassenger({...newPassenger, name: e.target.value})} />
          <Input placeholder="Email (optional)" value={newPassenger.email}
            onChange={(e) => setNewPassenger({...newPassenger, email: e.target.value})} />
          <Button onClick={addPassenger} variant="outline" size="sm" className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Passenger
          </Button>
        </div>

        <Button onClick={() => bookMutation.mutate()} disabled={!pickup || !dropoff} className="w-full">
          Book Group Ride
        </Button>
      </CardContent>
    </Card>
  );
}