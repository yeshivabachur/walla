import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from 'lucide-react';

export default function EarningsSplitView({ driverEmail }) {
  const { data: split } = useQuery({
    queryKey: ['earningsSplit', driverEmail],
    queryFn: async () => {
      const splits = await base44.entities.DriverEarningsSplit.filter({ driver_email: driverEmail });
      return splits[0];
    }
  });

  if (!split) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-green-600" />
          Earnings Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Total Fares</span>
          <span className="font-semibold">${split.total_fares}</span>
        </div>
        <div className="flex justify-between text-red-600">
          <span>Platform Fee</span>
          <span>-${split.platform_commission}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Tips</span>
          <span>+${split.tips}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Bonuses</span>
          <span>+${split.bonuses}</span>
        </div>
        <div className="flex justify-between border-t pt-2 font-bold">
          <span>Net Earnings</span>
          <span className="text-green-700">${split.driver_net_earnings}</span>
        </div>
      </CardContent>
    </Card>
  );
}