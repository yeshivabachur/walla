import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SmartDriverMatcher({ rideRequestId, passengerEmail }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const findMatches = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Find optimal driver matches for ride request.

Analyze matching factors:
1. Proximity (distance to pickup)
2. Rating compatibility
3. Passenger preference alignment
4. Previous positive interactions

Return top 3 driver matches with scores.`,
        response_json_schema: {
          type: 'object',
          properties: {
            matches: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  driver_email: { type: 'string' },
                  match_score: { type: 'number' },
                  proximity_score: { type: 'number' },
                  rating_compatibility: { type: 'number' },
                  preference_match: { type: 'number' }
                }
              }
            }
          }
        }
      });

      const driverMatches = result.matches || [];
      
      for (const match of driverMatches) {
        await base44.entities.DriverMatchScore.create({
          ride_request_id: rideRequestId,
          driver_email: match.driver_email,
          passenger_email: passengerEmail,
          match_score: match.match_score,
          factors: {
            proximity_score: match.proximity_score,
            rating_compatibility: match.rating_compatibility,
            preference_match: match.preference_match,
            history_score: 80
          },
          recommended: match.match_score > 85
        });
      }

      setMatches(driverMatches);
    };

    findMatches();
  }, [rideRequestId, passengerEmail]);

  if (matches.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-600" />
            Perfect Match Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {matches.slice(0, 1).map((match, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">Top Match</span>
                <Badge className="bg-green-600 text-white">
                  {match.match_score}% compatible
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <Users className="w-3 h-3 mx-auto mb-1 text-gray-500" />
                  <p className="text-gray-600">Proximity</p>
                  <p className="font-semibold">{match.proximity_score}%</p>
                </div>
                <div className="text-center">
                  <Star className="w-3 h-3 mx-auto mb-1 text-gray-500" />
                  <p className="text-gray-600">Rating</p>
                  <p className="font-semibold">{match.rating_compatibility}%</p>
                </div>
                <div className="text-center">
                  <Zap className="w-3 h-3 mx-auto mb-1 text-gray-500" />
                  <p className="text-gray-600">Preference</p>
                  <p className="font-semibold">{match.preference_match}%</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}