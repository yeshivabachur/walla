import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Star, TrendingUp } from 'lucide-react';
import ProgressRing from '@/components/ui/ProgressRing';
import { motion } from 'framer-motion';

export default function SafetyScoreCard({ score = 98, trends = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Safety Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <ProgressRing percentage={score} color="#3b82f6" />
          </div>

          <div className="space-y-2">
            {trends.map((trend, idx) => (
              <div key={idx} className="bg-white rounded-lg p-2 flex items-center justify-between">
                <span className="text-xs text-gray-700">{trend.label}</span>
                <div className="flex items-center gap-1">
                  {trend.improving ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <Star className="w-3 h-3 text-yellow-600" />
                  )}
                  <span className="text-xs font-semibold">{trend.value}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}