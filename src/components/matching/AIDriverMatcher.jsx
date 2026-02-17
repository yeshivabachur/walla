import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIDriverMatcher({ rideRequest, availableDrivers }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const matchDrivers = async () => {
      if (!availableDrivers || availableDrivers.length === 0) return;

      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyze driver matching for passenger preferences.

Available drivers: ${availableDrivers.length}
Passenger history: Regular rides from ${rideRequest.pickup_location}

Provide top 3 driver matches with scores and reasons based on:
- Driver ratings and reviews
- Past successful rides with similar passengers
- Driver location and ETA
- Vehicle type preferences
- Communication style match`,
          response_json_schema: {
            type: 'object',
            properties: {
              matches: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    driver_index: { type: 'number' },
                    score: { type: 'number' },
                    reasons: { type: 'array', items: { type: 'string' } }
                  }
                }
              }
            }
          }
        });

        setMatches(result.matches || []);
      } catch (error) {
        console.error('Driver matching failed:', error);
      }
    };

    matchDrivers();
  }, [rideRequest, availableDrivers]);

  if (matches.length === 0) return null;

  return (
    <Card className="border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          AI-Matched Drivers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {matches.slice(0, 3).map((match, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold text-gray-900">Match #{idx + 1}</span>
              </div>
              <Badge className="bg-indigo-600 text-white">
                {Math.round(match.score * 100)}% match
              </Badge>
            </div>
            <ul className="space-y-1 text-xs text-gray-600">
              {match.reasons?.map((reason, ridx) => (
                <li key={ridx} className="flex items-start gap-1">
                  <span className="text-indigo-500">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}