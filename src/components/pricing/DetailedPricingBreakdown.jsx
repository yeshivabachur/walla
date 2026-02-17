import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from 'lucide-react';

export default function DetailedPricingBreakdown({ rideRequestId }) {
  const { data: breakdown } = useQuery({
    queryKey: ['pricingBreakdown', rideRequestId],
    queryFn: async () => {
      const data = await base44.entities.PricingBreakdown.filter({ ride_request_id: rideRequestId });
      return data[0];
    }
  });

  if (!breakdown) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Receipt className="w-4 h-4 text-gray-600" />
          Pricing Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Base fare</span>
          <span>${breakdown.base_fare}</span>
        </div>
        <div className="flex justify-between">
          <span>Distance</span>
          <span>${breakdown.distance_charge}</span>
        </div>
        {breakdown.time_charge > 0 && (
          <div className="flex justify-between">
            <span>Time</span>
            <span>${breakdown.time_charge}</span>
          </div>
        )}
        {breakdown.surge_charge > 0 && (
          <div className="flex justify-between text-orange-600">
            <span>Surge</span>
            <span>${breakdown.surge_charge}</span>
          </div>
        )}
        <div className="flex justify-between border-t pt-1 font-bold">
          <span>Total</span>
          <span>${breakdown.total}</span>
        </div>
      </CardContent>
    </Card>
  );
}