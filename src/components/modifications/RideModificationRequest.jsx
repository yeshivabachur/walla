import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function RideModificationRequest({ rideRequestId }) {
  const [newDestination, setNewDestination] = useState('');

  const modifyMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.RideModification.create({
        ride_request_id: rideRequestId,
        modification_type: 'destination_change',
        new_value: newDestination,
        price_adjustment: 0,
        approved: false
      });
    },
    onSuccess: () => {
      toast.success('Modification request sent to driver');
      setNewDestination('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Edit className="w-4 h-4 text-blue-600" />
          Modify Ride
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Input
          placeholder="New destination"
          value={newDestination}
          onChange={(e) => setNewDestination(e.target.value)}
        />
        <Button 
          onClick={() => modifyMutation.mutate()} 
          disabled={!newDestination}
          className="w-full"
          size="sm"
        >
          Request Change
        </Button>
      </CardContent>
    </Card>
  );
}