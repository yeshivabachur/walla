import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, MapPin, Star, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { startOfMonth } from 'date-fns';

export default function PassengerStats({ requests }) {
  const completedRides = requests.filter(r => r.status === 'completed');
  const totalSpent = completedRides.reduce((sum, r) => sum + (r.estimated_price || 0), 0);
  const thisMonth = completedRides.filter(r => {
    const date = new Date(r.created_date);
    return date >= startOfMonth(new Date());
  });
  const avgRating = 4.8; // Could calculate from reviews given
  
  const mostUsedRoute = completedRides.reduce((acc, ride) => {
    const route = `${ride.pickup_location} → ${ride.dropoff_location}`;
    acc[route] = (acc[route] || 0) + 1;
    return acc;
  }, {});
  
  const topRoute = Object.entries(mostUsedRoute).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    {
      icon: TrendingUp,
      label: 'Total Rides',
      value: completedRides.length,
      color: 'bg-indigo-100 text-indigo-600',
      subtext: `${thisMonth.length} this month`
    },
    {
      icon: DollarSign,
      label: 'Total Spent',
      value: `$${totalSpent.toFixed(2)}`,
      color: 'bg-green-100 text-green-600',
      subtext: `Avg $${(totalSpent / Math.max(completedRides.length, 1)).toFixed(2)} per ride`
    },
    {
      icon: Star,
      label: 'Your Rating',
      value: avgRating.toFixed(1),
      color: 'bg-yellow-100 text-yellow-600',
      subtext: 'As a passenger'
    },
    {
      icon: MapPin,
      label: 'Favorite Route',
      value: topRoute ? topRoute[1] : 0,
      color: 'bg-purple-100 text-purple-600',
      subtext: topRoute ? topRoute[0].substring(0, 25) + '...' : 'No rides yet'
    }
  ];

  return (
    <Card className="border-0 shadow-lg mb-8">
      <CardHeader>
        <CardTitle>Your Ride Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 rounded-xl p-4"
              >
                <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtext}</p>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}