import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp } from 'lucide-react';

export default function DriverTierCard({ driverEmail }) {
  const { data: tier } = useQuery({
    queryKey: ['driverTier', driverEmail],
    queryFn: async () => {
      const tiers = await base44.entities.DriverTier.filter({ driver_email: driverEmail });
      return tiers[0];
    }
  });

  const tierColors = {
    bronze: 'bg-orange-600',
    silver: 'bg-gray-400',
    gold: 'bg-yellow-600',
    platinum: 'bg-purple-600',
    diamond: 'bg-cyan-600'
  };

  if (!tier) return null;

  return (
    <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Award className="w-4 h-4 text-indigo-600" />
          Driver Tier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold capitalize">{tier.tier}</span>
          <Badge className={`${tierColors[tier.tier]} text-white`}>
            {tier.total_rides} rides
          </Badge>
        </div>
        <div className="space-y-1">
          {tier.perks?.map((perk, idx) => (
            <div key={idx} className="text-xs flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span>{perk}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}