import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DestinationClusterAnalysis({ userEmail }) {
  const [clusters, setClusters] = useState(null);

  const { data: rides = [] } = useQuery({
    queryKey: ['clusterRides', userEmail],
    queryFn: () => base44.entities.RideRequest.filter({
      passenger_email: userEmail,
      status: 'completed'
    }, '-created_date', 50)
  });

  useEffect(() => {
    if (rides.length < 10) return;

    const analyzeClusters = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze destination patterns and clusters.

Total rides: ${rides.length}
Destinations: ${rides.map(r => r.dropoff_location).slice(0, 20).join(', ')}

Identify:
1. Top 3 destination clusters
2. Usage pattern for each
3. Recommended multi-stop routes
4. Time savings potential`,
        response_json_schema: {
          type: 'object',
          properties: {
            clusters: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  destinations: { type: 'array', items: { type: 'string' } },
                  frequency: { type: 'string' },
                  pattern: { type: 'string' }
                }
              }
            },
            multi_stop_suggestion: { type: 'string' },
            time_savings: { type: 'string' }
          }
        }
      });

      setClusters(result);
    };

    analyzeClusters();
  }, [rides, userEmail]);

  if (!clusters) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            Destination Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {clusters.clusters?.map((cluster, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-900">{cluster.name}</p>
                <span className="text-xs text-teal-600">{cluster.frequency}</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{cluster.pattern}</p>
              <div className="flex flex-wrap gap-1">
                {cluster.destinations?.slice(0, 3).map((dest, i) => (
                  <span key={i} className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded">
                    {dest}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}

          {clusters.multi_stop_suggestion && (
            <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3 h-3 text-teal-600" />
                <p className="text-xs font-semibold text-teal-800">Optimization Tip</p>
              </div>
              <p className="text-xs text-teal-700">{clusters.multi_stop_suggestion}</p>
              {clusters.time_savings && (
                <p className="text-xs text-teal-600 mt-1">⏱️ {clusters.time_savings}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}