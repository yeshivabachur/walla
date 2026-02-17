import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Star, Clock } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { motion } from 'framer-motion';

export default function DriverPerformanceDashboard({ driverEmail }) {
  const { data: rides = [] } = useQuery({
    queryKey: ['driverRides', driverEmail],
    queryFn: () => base44.entities.RideRequest.filter({
      driver_email: driverEmail,
      status: 'completed'
    })
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['driverReviews', driverEmail],
    queryFn: () => base44.entities.Review.filter({
      reviewee_email: driverEmail,
      reviewer_type: 'passenger'
    })
  });

  const totalEarnings = rides.reduce((sum, r) => sum + (r.estimated_price || 0), 0);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={TrendingUp}
              label="Total Rides"
              value={rides.length}
              color="indigo"
            />
            <StatCard
              icon={DollarSign}
              label="Total Earnings"
              value={`$${totalEarnings.toFixed(0)}`}
              color="green"
            />
            <StatCard
              icon={Star}
              label="Avg Rating"
              value={avgRating}
              color="orange"
            />
            <StatCard
              icon={Clock}
              label="Completion Rate"
              value="98%"
              color="blue"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}