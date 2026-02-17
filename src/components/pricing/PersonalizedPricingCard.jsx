import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Gift, TrendingDown, Zap } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export default function PersonalizedPricingCard({ userEmail }) {
  const { data: pricing } = useQuery({
    queryKey: ['personalizedPricing', userEmail],
    queryFn: async () => {
      let prices = await base44.entities.PersonalizedPricing.filter({ user_email: userEmail });
      if (prices.length === 0) {
        return await base44.entities.PersonalizedPricing.create({
          user_email: userEmail,
          loyalty_discount: 0,
          streak_bonus: 0,
          referral_credits: 0,
          vip_multiplier: 1.0,
          total_savings: 0,
          next_reward_at: 10
        });
      }
      return prices[0];
    },
    enabled: !!userEmail
  });

  if (!pricing) return null;

  const totalDiscount = pricing.loyalty_discount + pricing.streak_bonus;

  return (
    <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-600" />
            Your Savings
          </span>
          <Badge className="bg-green-600 text-white">
            ${pricing.total_savings.toFixed(0)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {totalDiscount > 0 && (
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Active Discounts</span>
              <TrendingDown className="w-4 h-4 text-green-600" />
            </div>
            <div className="space-y-1 text-xs">
              {pricing.loyalty_discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Loyalty</span>
                  <span className="text-green-600 font-semibold">-{pricing.loyalty_discount}%</span>
                </div>
              )}
              {pricing.streak_bonus > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Streak Bonus</span>
                  <span className="text-green-600 font-semibold">-{pricing.streak_bonus}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {pricing.referral_credits > 0 && (
          <div className="bg-blue-50 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">
                ${pricing.referral_credits} in credits
              </span>
            </div>
          </div>
        )}

        {pricing.personalized_offers?.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">Exclusive Offers</p>
            {pricing.personalized_offers.slice(0, 2).map((offer, idx) => (
              <div key={idx} className="bg-purple-50 rounded-lg p-2">
                <p className="text-xs font-semibold text-purple-800">{offer.title}</p>
                <p className="text-xs text-purple-600">{offer.discount}% off</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}