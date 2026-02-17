import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RewardMilestones({ userEmail }) {
  const { data: rides = [] } = useQuery({
    queryKey: ['userRides', userEmail],
    queryFn: () => base44.entities.RideRequest.filter({
      passenger_email: userEmail,
      status: 'completed'
    })
  });

  const { data: points = [] } = useQuery({
    queryKey: ['loyaltyPoints', userEmail],
    queryFn: () => base44.entities.LoyaltyPoints.filter({ user_email: userEmail })
  });

  const totalRides = rides.length;
  const totalPoints = points.reduce((sum, p) => sum + (p.points || 0), 0);

  const milestones = [
    { rides: 10, reward: 'Free ride credit', points: 100, icon: Gift },
    { rides: 25, reward: 'Priority support', points: 250, icon: Trophy },
    { rides: 50, reward: 'VIP status', points: 500, icon: Target },
    { rides: 100, reward: 'Lifetime discount', points: 1000, icon: Trophy }
  ];

  return (
    <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-600" />
          Reward Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-white rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600 mb-1">Total Rides</p>
          <p className="text-3xl font-bold text-amber-600">{totalRides}</p>
        </div>

        <div className="space-y-2">
          {milestones.map((milestone, idx) => {
            const isUnlocked = totalRides >= milestone.rides;
            const Icon = milestone.icon;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-lg p-3 ${
                  isUnlocked 
                    ? 'bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isUnlocked ? 'text-amber-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-semibold text-gray-900">
                      {milestone.rides} rides
                    </span>
                  </div>
                  {isUnlocked ? (
                    <Badge className="bg-amber-600 text-white">Unlocked</Badge>
                  ) : (
                    <Badge variant="outline">{milestone.rides - totalRides} to go</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-700">{milestone.reward}</p>
                <p className="text-xs text-amber-600 font-semibold">+{milestone.points} points</p>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}