import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Shield, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const tierConfig = {
  silver: { color: 'bg-gray-400', icon: '🥈', benefits: ['Priority matching', '24/7 support'], fee: 9.99 },
  gold: { color: 'bg-yellow-400', icon: '🥇', benefits: ['Priority matching', '24/7 support', 'Price protection', '5% discount'], fee: 19.99 },
  platinum: { color: 'bg-purple-400', icon: '💎', benefits: ['Priority matching', '24/7 VIP support', 'Price protection', '15% discount', 'Airport priority'], fee: 39.99 }
};

export default function VIPMembershipCard({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: membership } = useQuery({
    queryKey: ['vipMembership', userEmail],
    queryFn: async () => {
      const memberships = await base44.entities.VIPMembership.filter({ user_email: userEmail });
      return memberships[0];
    },
    enabled: !!userEmail
  });

  const upgradeMutation = useMutation({
    mutationFn: async (tier) => {
      if (!membership) {
        await base44.entities.VIPMembership.create({
          user_email: userEmail,
          tier: tier,
          monthly_fee: tierConfig[tier].fee,
          active: true
        });
      } else {
        await base44.entities.VIPMembership.update(membership.id, { tier: tier, monthly_fee: tierConfig[tier].fee });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vipMembership']);
      toast.success('VIP membership activated! 👑');
    }
  });

  if (membership?.active) {
    const config = tierConfig[membership.tier];
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className={`border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-600" />
                VIP Member
              </span>
              <Badge className={`${config.color} text-white text-lg`}>
                {config.icon} {membership.tier.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {config.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-sm text-gray-600">Monthly Fee</p>
              <p className="text-xl font-bold text-gray-900">${membership.monthly_fee}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-600" />
          Become a VIP
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 mb-4">
          Get priority matching, 24/7 support, and exclusive discounts
        </p>
        {Object.entries(tierConfig).map(([tier, config]) => (
          <Button
            key={tier}
            onClick={() => upgradeMutation.mutate(tier)}
            disabled={upgradeMutation.isPending}
            variant="outline"
            className="w-full rounded-xl justify-between"
          >
            <span>{config.icon} {tier.toUpperCase()}</span>
            <span>${config.fee}/mo</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}