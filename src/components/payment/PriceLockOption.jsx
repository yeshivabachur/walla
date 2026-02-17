import React from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function PriceLockOption({ rideRequestId, passengerEmail, currentPrice }) {
  const lockMutation = useMutation({
    mutationFn: async () => {
      const now = new Date();
      const expires = new Date(now.getTime() + 30 * 60000);
      return await base44.entities.PriceLockGuarantee.create({
        ride_request_id: rideRequestId,
        passenger_email: passengerEmail,
        locked_price: currentPrice,
        lock_duration_minutes: 30,
        locked_at: now.toISOString(),
        expires_at: expires.toISOString(),
        used: false
      });
    },
    onSuccess: () => {
      toast.success('Price locked for 30 minutes!');
    }
  });

  return (
    <Card className="border-2 border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Lock className="w-4 h-4 text-amber-600" />
          Price Lock Guarantee
          <Badge className="bg-amber-600">+$2</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-gray-600">Lock this price for 30 minutes. If surge increases, you still pay this price.</p>
        <div className="bg-white rounded p-2">
          <p className="text-xs text-gray-600">Locked Price</p>
          <p className="text-xl font-bold text-amber-600">${currentPrice.toFixed(2)}</p>
        </div>
        <Button onClick={() => lockMutation.mutate()} className="w-full" size="sm">
          <Clock className="w-4 h-4 mr-2" />
          Lock Price ($2 fee)
        </Button>
      </CardContent>
    </Card>
  );
}