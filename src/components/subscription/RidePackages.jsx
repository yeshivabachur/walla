import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Crown, Briefcase, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const PACKAGES = [
  {
    type: 'commuter',
    name: 'Commuter',
    icon: Zap,
    rides: 20,
    cost: 99,
    discount: 15,
    features: ['20 rides/month', '15% off each ride', 'Priority pickup', 'Standard support']
  },
  {
    type: 'premium',
    name: 'Premium',
    icon: Crown,
    rides: 40,
    cost: 179,
    discount: 20,
    features: ['40 rides/month', '20% off each ride', 'Priority pickup', 'Premium vehicles', '24/7 support']
  },
  {
    type: 'business',
    name: 'Business',
    icon: Briefcase,
    rides: 60,
    cost: 249,
    discount: 25,
    features: ['60 rides/month', '25% off each ride', 'Priority pickup', 'Luxury vehicles', 'Dedicated account manager', 'Expense reports']
  }
];

export default function RidePackages({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: activePackage } = useQuery({
    queryKey: ['ridePackage', userEmail],
    queryFn: async () => {
      const packages = await base44.entities.RidePackage.filter({ 
        user_email: userEmail, 
        status: 'active' 
      });
      return packages[0];
    },
    enabled: !!userEmail
  });

  const subscribeMutation = useMutation({
    mutationFn: async (packageType) => {
      const pkg = PACKAGES.find(p => p.type === packageType);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await base44.entities.RidePackage.create({
        user_email: userEmail,
        package_type: packageType,
        rides_included: pkg.rides,
        monthly_cost: pkg.cost,
        discount_percentage: pkg.discount,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        auto_renew: true,
        status: 'active'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ridePackage']);
      toast.success('Package activated! Enjoy your benefits.');
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.RidePackage.update(activePackage.id, { status: 'cancelled', auto_renew: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ridePackage']);
      toast.success('Package cancelled. Valid until end of billing period.');
    }
  });

  return (
    <div className="space-y-6">
      {activePackage && (
        <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Active Package</span>
              <Badge className="bg-indigo-600 text-white">Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Package</span>
              <span className="font-semibold">{activePackage.package_type.charAt(0).toUpperCase() + activePackage.package_type.slice(1)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rides Used</span>
              <span className="font-semibold">{activePackage.rides_used} / {activePackage.rides_included}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{ width: `${(activePackage.rides_used / activePackage.rides_included) * 100}%` }}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="w-full rounded-xl"
            >
              Cancel Subscription
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PACKAGES.map((pkg) => {
          const Icon = pkg.icon;
          const isActive = activePackage?.package_type === pkg.type;

          return (
            <motion.div
              key={pkg.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className={`border-2 ${isActive ? 'border-indigo-500' : 'border-gray-200'} hover:border-indigo-300 transition-all`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-8 h-8 text-indigo-600" />
                    {isActive && <Badge className="bg-green-500">Active</Badge>}
                  </div>
                  <CardTitle>{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900">
                    ${pkg.cost}
                    <span className="text-sm text-gray-500 font-normal">/month</span>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    Save {pkg.discount}% per ride
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => subscribeMutation.mutate(pkg.type)}
                    disabled={isActive || subscribeMutation.isPending}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl"
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