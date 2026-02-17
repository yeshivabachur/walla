import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Star, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PerformanceSnapshot({ driverEmail }) {
  const { data: todayRides = [] } = useQuery({
    queryKey: ['todayDriverRides', driverEmail],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      return await base44.entities.RideRequest.filter({
        driver_email: driverEmail,
        status: 'completed',
        created_date: { $gte: today }
      });
    },
    refetchInterval: 30000
  });

  const metrics = [
    { icon: Clock, label: 'Rides', value: todayRides.length, color: 'text-blue-600' },
    { icon: Star, label: 'Rating', value: '4.9', color: 'text-yellow-600' },
    { icon: TrendingUp, label: 'Efficiency', value: '95%', color: 'text-green-600' },
    { icon: DollarSign, label: 'Avg Fare', value: '$24', color: 'text-purple-600' }
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Today's Performance</p>
        <div className="grid grid-cols-4 gap-2">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-50 rounded-lg p-2 text-center"
            >
              <metric.icon className={`w-4 h-4 mx-auto mb-1 ${metric.color}`} />
              <p className="text-xs text-gray-500">{metric.label}</p>
              <p className="text-sm font-bold text-gray-900">{metric.value}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}