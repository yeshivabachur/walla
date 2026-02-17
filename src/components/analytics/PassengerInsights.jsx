import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, MapPin, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PassengerInsights({ userEmail }) {
  const { data: rides = [] } = useQuery({
    queryKey: ['passengerRides', userEmail],
    queryFn: () => base44.entities.RideRequest.filter({ passenger_email: userEmail, status: 'completed' })
  });

  if (rides.length === 0) return null;

  const totalSpent = rides.reduce((sum, r) => sum + (r.estimated_price || 0), 0);
  const avgPrice = totalSpent / rides.length;
  const topPickup = rides.reduce((acc, r) => {
    acc[r.pickup_location] = (acc[r.pickup_location] || 0) + 1;
    return acc;
  }, {});
  const mostCommon = Object.entries(topPickup).sort((a, b) => b[1] - a[1])[0];

  const insights = [
    { icon: DollarSign, label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, color: 'text-green-600' },
    { icon: TrendingUp, label: 'Avg Ride Cost', value: `$${avgPrice.toFixed(2)}`, color: 'text-blue-600' },
    { icon: MapPin, label: 'Top Pickup', value: mostCommon?.[0] || 'N/A', color: 'text-purple-600' },
    { icon: Clock, label: 'Total Rides', value: rides.length, color: 'text-indigo-600' }
  ];

  return (
    <Card className="border-0 shadow-lg mb-6">
      <CardHeader>
        <CardTitle>Your Ride Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {insights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-50 rounded-xl p-4"
            >
              <insight.icon className={`w-5 h-5 ${insight.color} mb-2`} />
              <p className="text-xs text-gray-500">{insight.label}</p>
              <p className="text-lg font-bold text-gray-900">{insight.value}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}