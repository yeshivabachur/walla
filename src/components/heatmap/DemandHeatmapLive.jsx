import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DemandHeatmapLive({ currentZone }) {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    const updateHeatmap = async () => {
      const zones = ['Downtown', 'Airport', 'University District', 'Suburbs'];
      const data = [];

      for (const zone of zones) {
        const demand = Math.floor(Math.random() * 100);
        const drivers = Math.floor(Math.random() * 30);
        const requests = Math.floor(Math.random() * 20);
        const surge = 1.0 + (demand > 70 ? 0.5 : 0);

        data.push({
          zone,
          demand_score: demand,
          active_drivers: drivers,
          pending_requests: requests,
          surge_level: surge,
          predicted_demand: demand + Math.floor(Math.random() * 20) - 10
        });

        await base44.entities.DemandHeatmap.create({
          zone,
          timestamp: new Date().toISOString(),
          demand_score: demand,
          active_drivers: drivers,
          pending_requests: requests,
          surge_level: surge,
          predicted_demand: demand + 10
        });
      }

      setHeatmapData(data.sort((a, b) => b.demand_score - a.demand_score));
    };

    updateHeatmap();
    const interval = setInterval(updateHeatmap, 30000);
    return () => clearInterval(interval);
  }, []);

  const getDemandColor = (score) => {
    if (score > 75) return 'from-red-500 to-orange-500';
    if (score > 50) return 'from-orange-500 to-yellow-500';
    if (score > 25) return 'from-yellow-500 to-green-500';
    return 'from-green-500 to-blue-500';
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Live Demand Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {heatmapData.map((zone, idx) => (
          <motion.div
            key={zone.zone}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white rounded-lg p-3 ${currentZone === zone.zone ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-gray-900">{zone.zone}</span>
              {zone.surge_level > 1.0 && (
                <Badge className="bg-orange-600 text-white">
                  {zone.surge_level}x surge
                </Badge>
              )}
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <motion.div
                className={`h-full bg-gradient-to-r ${getDemandColor(zone.demand_score)}`}
                initial={{ width: 0 }}
                animate={{ width: `${zone.demand_score}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{zone.active_drivers} drivers</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{zone.pending_requests} requests</span>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}