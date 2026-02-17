import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const rewards = [
  { type: 'free_ride', name: 'Free Ride', points: 500, icon: '🚗', description: 'One free ride up to $25' },
  { type: 'discount', name: '50% Off', points: 250, icon: '💰', description: 'Half off your next ride' },
  { type: 'upgrade', name: 'Premium Upgrade', points: 300, icon: '⬆️', description: 'Free luxury vehicle upgrade' },
  { type: 'priority_pickup', name: 'Priority Pickup', points: 150, icon: '⚡', description: 'Skip the queue for 1 week' },
  { type: 'airport_lounge', name: 'Airport Lounge Pass', points: 400, icon: '✈️', description: 'Access to airport lounges' }
];

export default function LoyaltyRewardsShop({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: loyalty } = useQuery({
    queryKey: ['loyaltyPoints', userEmail],
    queryFn: async () => {
      const points = await base44.entities.LoyaltyPoints.filter({ user_email: userEmail });
      return points[0];
    },
    enabled: !!userEmail
  });

  const { data: redemptions = [] } = useQuery({
    queryKey: ['redemptions', userEmail],
    queryFn: () => base44.entities.RewardRedemption.filter({ user_email: userEmail, used: false }),
    enabled: !!userEmail
  });

  const redeemMutation = useMutation({
    mutationFn: async ({ rewardType, pointsCost, description }) => {
      if (!loyalty || loyalty.points_balance < pointsCost) {
        throw new Error('Insufficient points');
      }

      await base44.entities.RewardRedemption.create({
        user_email: userEmail,
        reward_type: rewardType,
        points_cost: pointsCost,
        description,
        redeemed_date: new Date().toISOString(),
        used: false,
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      await base44.entities.LoyaltyPoints.update(loyalty.id, {
        points_balance: loyalty.points_balance - pointsCost,
        lifetime_points: loyalty.lifetime_points + pointsCost
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['loyaltyPoints']);
      queryClient.invalidateQueries(['redemptions']);
      toast.success('🎉 Reward redeemed! Check My Rides to use it.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to redeem reward');
    }
  });

  if (!loyalty) return null;

  return (
    <Card className="border-0 shadow-lg mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-600" />
            Rewards Shop
          </span>
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <Star className="w-3 h-3 mr-1" />
            {loyalty.points_balance || 0} pts
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Rewards */}
        {redemptions.length > 0 && (
          <div className="bg-green-50 rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-green-800 mb-2">🎁 Active Rewards</p>
            {redemptions.map((redemption) => (
              <div key={redemption.id} className="text-xs text-green-700">
                • {redemption.description} - Expires {new Date(redemption.expiry_date).toLocaleDateString()}
              </div>
            ))}
          </div>
        )}

        {/* Available Rewards */}
        <div className="grid grid-cols-1 gap-3">
          {rewards.map((reward, index) => {
            const canAfford = (loyalty.points_balance || 0) >= reward.points;
            
            return (
              <motion.div
                key={reward.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 ${
                  !canAfford && 'opacity-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-2xl">{reward.icon}</span>
                      {reward.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{reward.description}</p>
                  </div>
                  <Badge className="bg-purple-600 text-white whitespace-nowrap">
                    {reward.points} pts
                  </Badge>
                </div>
                <Button
                  size="sm"
                  onClick={() => redeemMutation.mutate({
                    rewardType: reward.type,
                    pointsCost: reward.points,
                    description: reward.name
                  })}
                  disabled={!canAfford || redeemMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {canAfford ? 'Redeem' : `Need ${reward.points - (loyalty.points_balance || 0)} more pts`}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Earn More Section */}
        <div className="bg-indigo-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Earn More Points
          </p>
          <div className="space-y-1 text-xs text-indigo-700">
            <p>• Complete 5 rides: +100 pts</p>
            <p>• Rate your driver: +10 pts per ride</p>
            <p>• Refer a friend: +200 pts</p>
            <p>• Weekly streak bonus: +50 pts</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}