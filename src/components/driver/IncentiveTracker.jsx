import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IncentiveTracker({ driverEmail }) {
  const { data: incentives = [] } = useQuery({
    queryKey: ['driverIncentives', driverEmail],
    queryFn: () => base44.entities.DriverIncentive.filter({ 
      driver_email: driverEmail, 
      status: 'active' 
    }),
    enabled: !!driverEmail
  });

  if (incentives.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Active Quests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {incentives.map((incentive) => {
            const progress = (incentive.progress / incentive.target) * 100;
            const timeLeft = new Date(incentive.expires_at) - new Date();
            const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));

            return (
              <div key={incentive.id} className="bg-white rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{incentive.title}</h4>
                    <p className="text-sm text-gray-600">{incentive.description}</p>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    ${incentive.reward_amount}
                  </Badge>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      {incentive.progress} / {incentive.target}
                    </span>
                    <span className="font-semibold text-green-600">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {hoursLeft}h left
                  </span>
                  {progress >= 100 && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Award className="w-3 h-3 mr-1" />
                      Completed!
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}