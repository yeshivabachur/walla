import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MapPin, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RealTimeHeatMap({ driverEmail }) {
  const [hotspots, setHotspots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHotspots = async () => {
      setIsLoading(true);
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Based on current time ${new Date().toLocaleString()} and day of week, predict the top 5 hotspot locations for ride-hailing demand.

Consider:
- Business districts during work hours
- Entertainment areas in evening
- Airports at typical travel times
- Residential areas during commute
- Events and venues

Return realistic locations with demand levels.`,
          response_json_schema: {
            type: 'object',
            properties: {
              hotspots: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    location: { type: 'string' },
                    demand: { type: 'string' },
                    estimated_earnings: { type: 'string' },
                    wait_time: { type: 'string' }
                  }
                }
              }
            }
          }
        });

        setHotspots(result.hotspots);
      } catch (error) {
        console.error('Failed to fetch hotspots:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotspots();
    const interval = setInterval(fetchHotspots, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const demandColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  return (
    <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          Real-Time Demand Hotspots
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-gray-600">Loading hotspots...</p>
        ) : (
          hotspots.map((spot, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <p className="font-semibold text-gray-900">{spot.location}</p>
                </div>
                <Badge className={demandColors[spot.demand?.toLowerCase()] || demandColors.medium}>
                  {spot.demand} demand
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1 text-gray-600">
                  <DollarSign className="w-3 h-3" />
                  {spot.estimated_earnings}
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Users className="w-3 h-3" />
                  ~{spot.wait_time} wait
                </div>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}