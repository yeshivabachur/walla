import React from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function StrangerRideSplitter({ rideRequestId, userEmail, estimatedPrice }) {
  const requestSplitMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.RideSplitRequest.create({
        requester_email: userEmail,
        ride_request_id: rideRequestId,
        match_radius_km: 2,
        max_detour_minutes: 5,
        status: 'searching',
        savings_amount: Math.round(estimatedPrice * 0.3)
      });
    },
    onSuccess: (data) => {
      toast.success(`Searching for ride split - save $${data.savings_amount}!`);
    }
  });

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-green-600" />
          Split with Another Passenger
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-700 mb-3">
          Share your ride with another passenger going the same direction and save 30%!
        </p>
        <Button 
          onClick={() => requestSplitMutation.mutate()} 
          className="w-full bg-green-600 hover:bg-green-700"
          size="sm"
        >
          <DollarSign className="w-4 h-4 mr-1" />
          Find Split Partner
        </Button>
      </CardContent>
    </Card>
  );
}