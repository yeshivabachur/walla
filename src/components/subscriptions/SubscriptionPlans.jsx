import React from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionPlans({ userEmail }) {
  const queryClient = useQueryClient();

  const plans = [
    {
      tier: 'premium',
      name: 'Premium',
      price: 19.99,
      discount: 10,
      benefits: ['10% off all rides', 'Priority dispatch', 'No surge fees']
    },
    {
      tier: 'platinum',
      name: 'Platinum',
      price: 39.99,
      discount: 20,
      benefits: ['20% off all rides', 'Priority dispatch', 'No surge fees', 'Favorite drivers', 'Concierge support']
    }
  ];

  const subscribeMutation = useMutation({
    mutationFn: async (plan) => {
      return await base44.entities.PremiumSubscription.create({
        user_email: userEmail,
        tier: plan.tier,
        monthly_fee: plan.price,
        benefits: plan.benefits,
        discount_percentage: plan.discount,
        active: true,
        auto_renew: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['subscription']);
      toast.success('Subscription activated!');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-600" />
          Premium Plans
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {plans.map(plan => (
          <div key={plan.tier} className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <p className="text-2xl font-bold text-indigo-600">${plan.price}<span className="text-sm text-gray-600">/mo</span></p>
              </div>
              <Button
                onClick={() => subscribeMutation.mutate(plan)}
                disabled={subscribeMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Subscribe
              </Button>
            </div>
            <div className="space-y-1">
              {plan.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}