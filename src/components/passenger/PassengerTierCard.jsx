import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown } from 'lucide-react';

export default function PassengerTierCard({ passengerEmail }) {
  const { data: tier } = useQuery({
    queryKey: ['passengerTier', passengerEmail],
    queryFn: async () => {
      const tiers = await base44.entities.PassengerTier.filter({ passenger_email: passengerEmail });
      return tiers[0];
    }
  });

  const tierColors = {
    bronze: 'bg-orange-600',
    silver: 'bg-gray-400',
    gold: 'bg-yellow-600',
    platinum: 'bg-purple-600'
  };

  if (!tier) return null;

  return (
    <Card className="border-2 border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Crown className="w-4 h-4 text-purple-600" />
          Your Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold capitalize">{tier.tier}</span>
          <Badge className={`${tierColors[tier.tier]} text-white`}>
            {tier.total_rides} rides
          </Badge>
        </div>
        <p className="text-xs text-gray-600">${tier.total_spent} lifetime spend</p>
      </CardContent>
    </Card>
  );
}