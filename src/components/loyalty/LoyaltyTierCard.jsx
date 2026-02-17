import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const tierConfig = {
  bronze: { color: 'bg-orange-100 text-orange-800', icon: '🥉' },
  silver: { color: 'bg-gray-200 text-gray-800', icon: '🥈' },
  gold: { color: 'bg-yellow-100 text-yellow-800', icon: '🥇' },
  platinum: { color: 'bg-purple-100 text-purple-800', icon: '💎' },
  diamond: { color: 'bg-blue-100 text-blue-800', icon: '💠' }
};

export default function LoyaltyTierCard({ userEmail }) {
  const { data: loyalty } = useQuery({
    queryKey: ['loyaltyTier', userEmail],
    queryFn: async () => {
      const tiers = await base44.entities.LoyaltyTier.filter({ user_email: userEmail });
      if (tiers[0]) return tiers[0];
      
      return await base44.entities.LoyaltyTier.create({
        user_email: userEmail,
        tier: 'bronze',
        total_rides: 0,
        total_spent: 0,
        benefits: ['5% discount on all rides']
      });
    },
    enabled: !!userEmail
  });

  if (!loyalty) return null;

  const config = tierConfig[loyalty.tier];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-indigo-600" />
              Loyalty Status
            </span>
            <Badge className={config.color}>
              {config.icon} {loyalty.tier.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-xl p-3">
            <p className="text-sm text-gray-600">Total Rides: <span className="font-bold">{loyalty.total_rides}</span></p>
            <p className="text-sm text-gray-600">Total Spent: <span className="font-bold">${loyalty.total_spent?.toFixed(2)}</span></p>
          </div>
          {loyalty.next_tier_rides && (
            <div className="bg-indigo-100 rounded-xl p-3">
              <p className="text-xs text-indigo-800 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {loyalty.next_tier_rides} more rides to next tier!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}