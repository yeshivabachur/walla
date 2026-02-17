import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RealTimeEarningsWidget({ driverEmail }) {
  const { data: todayEarnings = [] } = useQuery({
    queryKey: ['todayEarnings', driverEmail],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      return await base44.entities.DriverEarnings.filter({
        driver_email: driverEmail,
        created_date: { $gte: today }
      });
    },
    refetchInterval: 10000
  });

  const totalToday = todayEarnings.reduce((sum, e) => sum + (e.driver_earning || 0), 0);
  const ridesCount = todayEarnings.length;
  const avgPerRide = ridesCount > 0 ? totalToday / ridesCount : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">Today's Earnings</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              Live
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3">
              <p className="text-3xl font-bold text-green-600">
                ${totalToday.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total earned today</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-500">Rides</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{ridesCount}</p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Target className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-500">Avg/Ride</p>
                </div>
                <p className="text-lg font-bold text-gray-900">${avgPerRide.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}