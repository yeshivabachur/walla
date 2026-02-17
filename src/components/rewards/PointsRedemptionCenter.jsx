import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from 'lucide-react';
import { toast } from 'sonner';

export default function PointsRedemptionCenter({ passengerEmail, availablePoints }) {
  const queryClient = useQueryClient();

  const redeemMutation = useMutation({
    mutationFn: async ({ points, type, value }) => {
      return await base44.entities.PointsRedemption.create({
        passenger_email: passengerEmail,
        points_redeemed: points,
        reward_type: type,
        reward_value: value,
        redemption_date: new Date().toISOString(),
        used: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['loyaltyPoints']);
      toast.success('Reward redeemed!');
    }
  });

  const rewards = [
    { points: 500, type: 'discount', value: 5, label: '$5 Off' },
    { points: 1000, type: 'discount', value: 10, label: '$10 Off' },
    { points: 2000, type: 'free_ride', value: 20, label: 'Free Ride ($20)' },
    { points: 3000, type: 'upgrade', value: 30, label: 'Premium Upgrade' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Gift className="w-4 h-4 text-purple-600" />
          Redeem Points
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="bg-purple-50 rounded p-2 mb-3">
          <p className="text-xs text-gray-600">Available Points</p>
          <p className="text-2xl font-bold text-purple-600">{availablePoints || 0}</p>
        </div>
        {rewards.map(reward => (
          <div key={reward.points} className="flex justify-between items-center bg-white rounded p-2 border">
            <div>
              <p className="text-sm font-semibold">{reward.label}</p>
              <p className="text-xs text-gray-600">{reward.points} points</p>
            </div>
            <Button
              onClick={() => redeemMutation.mutate(reward)}
              disabled={availablePoints < reward.points}
              size="sm"
            >
              Redeem
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}