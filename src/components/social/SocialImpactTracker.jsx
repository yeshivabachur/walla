import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SocialImpactTracker({ userEmail }) {
  const { data: impact } = useQuery({
    queryKey: ['socialImpact', userEmail],
    queryFn: async () => {
      const impacts = await base44.entities.SocialImpact.filter({ user_email: userEmail });
      if (impacts[0]) return impacts[0];
      
      return await base44.entities.SocialImpact.create({
        user_email: userEmail,
        charity_donations: 0,
        rides_donated: 0,
        impact_score: 0
      });
    },
    enabled: !!userEmail
  });

  if (!impact) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            Social Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3">
              <p className="text-xs text-gray-600">Donated</p>
              <p className="text-lg font-bold text-gray-900">${impact.charity_donations}</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-xs text-gray-600">Impact Score</p>
              <p className="text-lg font-bold text-red-600 flex items-center gap-1">
                {impact.impact_score}
                <TrendingUp className="w-3 h-3" />
              </p>
            </div>
          </div>
          {impact.rides_donated > 0 && (
            <div className="bg-red-100 rounded-xl p-3">
              <p className="text-xs text-red-800">
                🎁 {impact.rides_donated} rides donated to those in need
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}