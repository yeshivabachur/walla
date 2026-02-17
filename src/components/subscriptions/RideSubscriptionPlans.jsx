import React from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const plans = [
  {
    id: 'commuter',
    name: 'Commuter',
    price: 99,
    rides: 40,
    maxValue: 15,
    features: ['40 rides/month', 'Up to $15 per ride', 'Priority booking', 'Save up to 30%']
  },
  {
    id: 'weekend',
    name: 'Weekend',
    price: 49,
    rides: 12,
    maxValue: 25,
    features: ['12 rides/month', 'Up to $25 per ride', 'Weekend priority', 'Save up to 20%']
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 299,
    rides: 999,
    maxValue: 30,
    features: ['Unlimited rides', 'Up to $30 per ride', 'VIP treatment', 'Best value']
  }
];

export default function RideSubscriptionPlans({ userEmail }) {
  const queryClient = useQueryClient();

  const subscribeMutation = useMutation({
    mutationFn: async (plan) => {
      const planData = plans.find(p => p.id === plan);
      await base44.entities.RideSubscription.create({
        user_email: userEmail,
        plan_type: plan,
        monthly_fee: planData.price,
        included_rides: planData.rides,
        rides_used: 0,
        max_ride_value: planData.maxValue,
        active: true,
        renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rideSubscription']);
      toast.success('Subscription activated!');
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {plans.map((plan, i) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <div className="flex items-center justify-between mb-2">
                <Car className="w-6 h-6" />
                {plan.id === 'unlimited' && <Badge className="bg-yellow-500 text-white">Popular</Badge>}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-white/80">/month</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => subscribeMutation.mutate(plan.id)}
                disabled={subscribeMutation.isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              >
                Subscribe
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}