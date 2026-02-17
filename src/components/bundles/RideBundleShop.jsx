import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function RideBundleShop({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: bundles = [] } = useQuery({
    queryKey: ['bundles'],
    queryFn: async () => [
      { id: '1', package_name: 'Starter Pack', number_of_rides: 10, total_price: 80, price_per_ride: 8, savings_amount: 20 },
      { id: '2', package_name: 'Commuter Pack', number_of_rides: 20, total_price: 140, price_per_ride: 7, savings_amount: 60 },
      { id: '3', package_name: 'Super Pack', number_of_rides: 50, total_price: 300, price_per_ride: 6, savings_amount: 200 }
    ]
  });

  const purchaseMutation = useMutation({
    mutationFn: async (bundleId) => {
      const bundle = bundles.find(b => b.id === bundleId);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 90);
      
      return await base44.entities.UserPurchasedBundle.create({
        user_email: userEmail,
        bundle_id: bundleId,
        purchase_date: new Date().toISOString().split('T')[0],
        rides_remaining: bundle.number_of_rides,
        expiry_date: expiryDate.toISOString().split('T')[0],
        active: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['purchasedBundles']);
      toast.success('Bundle purchased!');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Package className="w-4 h-4 text-indigo-600" />
          Ride Bundles - Save More
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bundles.map(bundle => (
          <div key={bundle.id} className="border rounded p-3 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold">{bundle.package_name}</p>
                <p className="text-xs text-gray-600">{bundle.number_of_rides} rides</p>
              </div>
              <Badge className="bg-green-600">Save ${bundle.savings_amount}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-bold text-indigo-600">${bundle.total_price}</p>
                <p className="text-xs text-gray-600">${bundle.price_per_ride}/ride</p>
              </div>
              <Button onClick={() => purchaseMutation.mutate(bundle.id)} size="sm">
                Buy Now
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}