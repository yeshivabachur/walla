import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function RideSubscriptionManager({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: subscription } = useQuery({
    queryKey: ['rideSubscription', userEmail],
    queryFn: async () => {
      const subs = await base44.entities.RideSubscription.filter({ user_email: userEmail, active: true });
      return subs[0];
    }
  });

  const subscribeMutation = useMutation({
    mutationFn: async (plan) => {
      return await base44.entities.RideSubscription.create({
        user_email: userEmail,
        plan_name: plan.name,
        rides_per_month: plan.rides,
        monthly_cost: plan.cost,
        savings: plan.savings,
        active: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rideSubscription']);
      toast.success('Subscribed!');
    }
  });

  const plans = [
    { name: 'Commuter', rides: 20, cost: 99, savings: 40 },
    { name: 'Premium', rides: 40, cost: 179, savings: 100 }
  ];

  if (subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-indigo-600" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{subscription.plan_name}</span>
              <Badge className="bg-green-600">Active</Badge>
            </div>
            <p className="text-sm text-gray-600">
              {subscription.rides_used}/{subscription.rides_per_month} rides used
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Ride Subscriptions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {plans.map(plan => (
          <div key={plan.name} className="border rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm">{plan.name}</span>
              <span className="text-sm">${plan.cost}/mo</span>
            </div>
            <p className="text-xs text-gray-600 mb-2">{plan.rides} rides • Save ${plan.savings}</p>
            <Button size="sm" className="w-full" onClick={() => subscribeMutation.mutate(plan)}>
              Subscribe
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}