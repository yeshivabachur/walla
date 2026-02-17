import React from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const tiers = [
  {
    id: 'plus',
    name: 'Plus',
    price: 9.99,
    icon: Zap,
    color: 'from-blue-500 to-blue-600',
    benefits: ['10% off all rides', '5 ride credits/month', 'Priority support', 'No cancellation fees']
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    icon: Sparkles,
    color: 'from-purple-500 to-purple-600',
    benefits: ['20% off all rides', '15 ride credits/month', '24/7 priority support', 'Airport lounge access', 'Free ride sharing']
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    price: 49.99,
    icon: Crown,
    color: 'from-yellow-500 to-yellow-600',
    benefits: ['30% off all rides', '50 ride credits/month', 'Dedicated concierge', 'Airport lounge access', 'Luxury vehicles only', 'Free cancellations', 'VIP events access']
  }
];

export default function PremiumTiers({ userEmail, currentTier }) {
  const queryClient = useQueryClient();

  const subscribeMutation = useMutation({
    mutationFn: async (tier) => {
      const tierData = tiers.find(t => t.id === tier);
      await base44.entities.PremiumSubscription.create({
        user_email: userEmail,
        tier: tier,
        monthly_fee: tierData.price,
        benefits: tierData.benefits,
        ride_credits: parseInt(tierData.benefits.find(b => b.includes('credits')).split(' ')[0]),
        discount_percentage: parseInt(tierData.benefits[0].split('%')[0]),
        priority_support: true,
        airport_lounge_access: tier !== 'plus',
        concierge_service: tier === 'ultimate',
        active: true,
        renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['premiumSubscription']);
      toast.success('Premium subscription activated!');
    }
  });

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Choose Your Plan</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier, i) => {
          const Icon = tier.icon;
          const isActive = currentTier === tier.id;
          
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`border-0 shadow-lg overflow-hidden ${isActive ? 'ring-2 ring-indigo-600' : ''}`}>
                <CardHeader className={`bg-gradient-to-br ${tier.color} text-white pb-8`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-8 h-8" />
                    {isActive && <Badge className="bg-white text-gray-900">Active</Badge>}
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    <span className="text-white/80">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 mb-6">
                    {tier.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => subscribeMutation.mutate(tier.id)}
                    disabled={isActive || subscribeMutation.isPending}
                    className={`w-full rounded-xl bg-gradient-to-br ${tier.color} hover:opacity-90`}
                  >
                    {isActive ? 'Current Plan' : 'Subscribe'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}