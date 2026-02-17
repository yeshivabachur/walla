import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, MapPin, Clock, DollarSign, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DriverCoPilot({ driverEmail, currentLocation }) {
  const [liveAdvice, setLiveAdvice] = useState(null);

  const { data: surgeZones = [] } = useQuery({
    queryKey: ['surgeZones'],
    queryFn: () => base44.entities.SurgeZone.list(),
    refetchInterval: 10000
  });

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pendingRequests'],
    queryFn: () => base44.entities.RideRequest.filter({ status: 'pending' }),
    refetchInterval: 5000
  });

  useEffect(() => {
    if (!driverEmail) return;

    const generateAdvice = async () => {
      const highDemandZones = surgeZones
        .filter(z => z.current_multiplier >= 1.3)
        .sort((a, b) => b.current_multiplier - a.current_multiplier)
        .slice(0, 3);

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Provide real-time earnings optimization advice for a driver:

Current Situation:
- Pending Requests: ${pendingRequests.length}
- High-demand zones: ${highDemandZones.map(z => `${z.zone_name} (${z.current_multiplier}x)`).join(', ')}
- Current time: ${new Date().toLocaleTimeString()}

Provide immediate actionable advice:
1. Best zone to move to now
2. Estimated earning potential in next hour
3. Quick tactical tip
4. Optimal break time suggestion`,
        response_json_schema: {
          type: 'object',
          properties: {
            best_zone: { type: 'string' },
            zone_reason: { type: 'string' },
            earning_potential: { type: 'string' },
            tactical_tip: { type: 'string' },
            break_suggestion: { type: 'string' }
          }
        }
      });

      setLiveAdvice(result);
    };

    generateAdvice();
    const interval = setInterval(generateAdvice, 180000); // Update every 3 minutes

    return () => clearInterval(interval);
  }, [driverEmail, surgeZones, pendingRequests]);

  if (!liveAdvice) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="w-6 h-6" />
              AI Co-Pilot Live
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Best Zone */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Move to: {liveAdvice.best_zone}</span>
              </div>
              <p className="text-sm text-white/90">{liveAdvice.zone_reason}</p>
            </div>

            {/* Earning Potential */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-300" />
                <span className="font-semibold">Next Hour Potential</span>
              </div>
              <p className="text-2xl font-bold text-green-300">{liveAdvice.earning_potential}</p>
            </div>

            {/* Tactical Tip */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-300" />
                <span className="font-semibold">Pro Tip</span>
              </div>
              <p className="text-sm text-white/90">{liveAdvice.tactical_tip}</p>
            </div>

            {/* Break Suggestion */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-300" />
                <span className="font-semibold">Break Time</span>
              </div>
              <p className="text-sm text-white/90">{liveAdvice.break_suggestion}</p>
            </div>

            <Badge className="w-full justify-center bg-yellow-400 text-yellow-900 py-2">
              <Zap className="w-3 h-3 mr-1" />
              Updates every 3 minutes
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}