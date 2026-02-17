import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, TrendingDown, TreePine, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CarbonTracker({ userEmail }) {
  const [totalImpact, setTotalImpact] = useState(null);

  const { data: footprints = [] } = useQuery({
    queryKey: ['carbonFootprints', userEmail],
    queryFn: () => base44.entities.CarbonFootprint.filter({ user_email: userEmail }),
    enabled: !!userEmail
  });

  useEffect(() => {
    if (footprints.length === 0) return;

    const total = {
      totalRides: footprints.length,
      totalCO2Saved: footprints.reduce((sum, f) => sum + f.co2_saved_kg, 0),
      totalDistance: footprints.reduce((sum, f) => sum + f.distance_km, 0),
      treesEquivalent: footprints.reduce((sum, f) => sum + f.trees_equivalent, 0)
    };

    setTotalImpact(total);
  }, [footprints]);

  if (!totalImpact || totalImpact.totalRides === 0) return null;

  const achievementLevel = 
    totalImpact.totalCO2Saved > 100 ? 'Eco Champion' :
    totalImpact.totalCO2Saved > 50 ? 'Green Leader' :
    totalImpact.totalCO2Saved > 20 ? 'Eco Warrior' :
    'Green Starter';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Your Environmental Impact
            </span>
            <Badge className="bg-green-600 text-white">
              <Award className="w-3 h-3 mr-1" />
              {achievementLevel}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">CO₂ Saved</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {totalImpact.totalCO2Saved.toFixed(1)} kg
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TreePine className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">Trees</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(totalImpact.treesEquivalent)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3">
            <p className="text-sm text-gray-700">
              By riding with Walla, you've saved the equivalent of{' '}
              <strong>{Math.round(totalImpact.treesEquivalent)} trees</strong> absorbing CO₂ for a year!
            </p>
          </div>

          <div className="text-xs text-center text-gray-600">
            🌍 Total rides: {totalImpact.totalRides} • Distance: {totalImpact.totalDistance.toFixed(1)} km
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}