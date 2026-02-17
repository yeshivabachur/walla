import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StreakBonusTracker({ userEmail }) {
  const { data: bonuses = [] } = useQuery({
    queryKey: ['streakBonuses', userEmail],
    queryFn: () => base44.entities.RideStreakBonus.filter({
      user_email: userEmail,
      claimed: false
    })
  });

  const totalValue = bonuses.reduce((sum, b) => sum + (b.bonus_amount || 0), 0);

  if (bonuses.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Streak Bonuses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-sm text-gray-600 mb-1">Total Unclaimed</p>
            <p className="text-2xl font-bold text-yellow-600">${totalValue}</p>
          </div>

          {bonuses.map((bonus, idx) => (
            <motion.div
              key={bonus.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {bonus.streak_count} Day Streak
                  </p>
                  <p className="text-xs text-gray-600">${bonus.bonus_amount} {bonus.bonus_type}</p>
                </div>
              </div>
              <Badge className="bg-yellow-600 text-white">Ready</Badge>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}