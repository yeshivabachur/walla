import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, Car } from 'lucide-react';

export default function RealTimeDashboard({ driverEmail }) {
  const [metrics, setMetrics] = useState({
    todayEarnings: 0,
    activeRides: 0,
    completedToday: 0,
    averageRating: 0
  });

  useEffect(() => {
    const loadMetrics = async () => {
      const today = new Date().toISOString().split('T')[0];
      const earnings = await base44.entities.DriverEarningsPerHour.filter({
        driver_email: driverEmail,
        date: today
      });
      
      const totalEarnings = earnings.reduce((sum, e) => sum + e.net_earnings, 0);
      
      setMetrics({
        todayEarnings: totalEarnings,
        activeRides: 0,
        completedToday: earnings.reduce((sum, e) => sum + e.rides_completed, 0),
        averageRating: 4.8
      });
    };
    
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, [driverEmail]);

  const stats = [
    { label: "Today's Earnings", value: `$${metrics.todayEarnings.toFixed(2)}`, icon: DollarSign, color: "text-green-600" },
    { label: "Rides Today", value: metrics.completedToday, icon: Car, color: "text-blue-600" },
    { label: "Average Rating", value: metrics.averageRating.toFixed(1), icon: TrendingUp, color: "text-yellow-600" },
    { label: "Active Now", value: metrics.activeRides, icon: Users, color: "text-purple-600" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-gray-600">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}