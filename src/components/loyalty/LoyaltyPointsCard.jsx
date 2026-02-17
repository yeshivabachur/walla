import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Gift, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const tierConfig = {
  bronze: { color: 'bg-orange-600', icon: '🥉', pointsNeeded: 0, perks: '1 point per $1' },
  silver: { color: 'bg-gray-400', icon: '🥈', pointsNeeded: 500, perks: '1.5 points per $1' },
  gold: { color: 'bg-yellow-500', icon: '🥇', pointsNeeded: 2000, perks: '2 points per $1' },
  platinum: { color: 'bg-purple-600', icon: '💎', pointsNeeded: 5000, perks: '3 points per $1' }
};

const rewards = [
  { points: 100, value: 5, label: '$5 Off' },
  { points: 250, value: 15, label: '$15 Off' },
  { points: 500, value: 35, label: '$35 Off' },
  { points: 1000, value: 80, label: '$80 Off' }
];

export default function LoyaltyPointsCard({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: loyalty } = useQuery({
    queryKey: ['loyaltyPoints', userEmail],
    queryFn: async () => {
      const points = await base44.entities.LoyaltyPoints.filter({ user_email: userEmail });
      if (points[0]) return points[0];
      
      // Create initial loyalty account
      const newLoyalty = await base44.entities.LoyaltyPoints.create({
        user_email: userEmail,
        points: 0,
        tier: 'bronze',
        lifetime_points: 0
      });
      return newLoyalty;
    },
    enabled: !!userEmail
  });

  const redeemMutation = useMutation({
    mutationFn: async (reward) => {
      const newPoints = loyalty.points - reward.points;
      await base44.entities.LoyaltyPoints.update(loyalty.id, {
        points: newPoints,
        points_redeemed_history: [
          ...loyalty.points_redeemed_history,
          { date: new Date().toISOString(), points: reward.points, value: reward.value }
        ]
      });
      
      // Create promo code
      await base44.entities.PromoCode.create({
        code: `POINTS${Math.random().toString(36).substring(7).toUpperCase()}`,
        discount_type: 'fixed',
        discount_value: reward.value,
        max_uses: 1,
        user_specific: userEmail,
        active: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['loyaltyPoints']);
      toast.success('Points redeemed! Check your promos.');
    }
  });

  if (!loyalty) return null;

  const currentTier = tierConfig[loyalty.tier];
  const nextTierIndex = Object.keys(tierConfig).indexOf(loyalty.tier) + 1;
  const nextTier = nextTierIndex < Object.keys(tierConfig).length 
    ? tierConfig[Object.keys(tierConfig)[nextTierIndex]]
    : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-600" />
              Loyalty Points
            </span>
            <Badge className={`${currentTier.color} text-white text-lg px-3 py-1`}>
              {currentTier.icon} {loyalty.tier.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Available Points</p>
            <p className="text-4xl font-bold text-purple-600">{loyalty.points}</p>
            <p className="text-xs text-gray-500 mt-1">{currentTier.perks}</p>
          </div>

          {nextTier && (
            <div className="bg-purple-100 rounded-xl p-3">
              <p className="text-sm text-purple-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {nextTier.pointsNeeded - loyalty.lifetime_points} points to {Object.keys(tierConfig)[nextTierIndex].toUpperCase()}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Redeem Points</p>
            <div className="grid grid-cols-2 gap-2">
              {rewards.map(reward => (
                <Button
                  key={reward.points}
                  onClick={() => redeemMutation.mutate(reward)}
                  disabled={loyalty.points < reward.points || redeemMutation.isPending}
                  variant="outline"
                  className="rounded-xl h-auto py-3 flex flex-col"
                >
                  <Gift className="w-4 h-4 mb-1" />
                  <span className="font-bold">{reward.label}</span>
                  <span className="text-xs text-gray-500">{reward.points} pts</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}