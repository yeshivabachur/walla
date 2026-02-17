import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RidePatternAnalysis({ userEmail }) {
  const [patterns, setPatterns] = useState(null);

  const { data: rides = [] } = useQuery({
    queryKey: ['userRidePatterns', userEmail],
    queryFn: () => base44.entities.RideRequest.filter({
      passenger_email: userEmail,
      status: 'completed'
    }, '-created_date', 30)
  });

  useEffect(() => {
    if (rides.length < 5) return;

    const analyzePatterns = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze ride patterns for user optimization.

Total rides: ${rides.length}
Recent routes: ${rides.map(r => `${r.pickup_location} → ${r.dropoff_location}`).slice(0, 5).join(', ')}

Identify:
1. Most common ride times (morning/afternoon/evening)
2. Favorite routes (top 2)
3. Ride frequency pattern (daily/weekly/occasional)
4. Best time for cost savings`,
        response_json_schema: {
          type: 'object',
          properties: {
            peak_times: { type: 'array', items: { type: 'string' } },
            favorite_routes: { type: 'array', items: { type: 'string' } },
            frequency: { type: 'string' },
            savings_tip: { type: 'string' }
          }
        }
      });

      setPatterns(result);
    };

    analyzePatterns();
  }, [rides]);

  if (!patterns) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-600" />
            Your Ride Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-cyan-600" />
              <p className="text-xs font-semibold text-gray-700">Peak Times</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {patterns.peak_times?.map((time, idx) => (
                <span key={idx} className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded">
                  {time}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-cyan-600" />
              <p className="text-xs font-semibold text-gray-700">Favorite Routes</p>
            </div>
            {patterns.favorite_routes?.map((route, idx) => (
              <p key={idx} className="text-xs text-gray-700 mb-1">• {route}</p>
            ))}
          </div>

          {patterns.savings_tip && (
            <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
              <p className="text-xs text-cyan-800">💡 {patterns.savings_tip}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}