import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RideRecommendations({ userEmail, onSelectRoute }) {
  // Fetch past rides to analyze patterns
  const { data: pastRides = [] } = useQuery({
    queryKey: ['pastRides', userEmail],
    queryFn: () => base44.entities.RideRequest.filter({ 
      passenger_email: userEmail,
      status: 'completed'
    }, '-created_date', 50),
    enabled: !!userEmail
  });

  // Fetch preferences
  const { data: preferences } = useQuery({
    queryKey: ['preferences', userEmail],
    queryFn: async () => {
      const prefs = await base44.entities.PassengerPreferences.filter({ passenger_email: userEmail });
      return prefs[0];
    },
    enabled: !!userEmail
  });

  // Generate AI recommendations using LLM
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations', userEmail, pastRides.length],
    queryFn: async () => {
      if (pastRides.length === 0) return null;

      const ridesData = pastRides.slice(0, 20).map(r => ({
        pickup: r.pickup_location,
        dropoff: r.dropoff_location,
        time: new Date(r.created_date).toISOString(),
        day: new Date(r.created_date).getDay()
      }));

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze these ride patterns and generate 3 smart ride suggestions:

Rides: ${JSON.stringify(ridesData)}

Consider:
1. Frequent routes
2. Time of day patterns
3. Day of week patterns
4. Common destinations

Return recommendations as a JSON array with this structure:
{
  "recommendations": [
    {
      "title": "Morning Commute",
      "description": "Your usual Monday-Friday route",
      "pickup": "Home",
      "dropoff": "Office",
      "confidence": "high",
      "reason": "You take this route 80% of weekday mornings"
    }
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  pickup: { type: "string" },
                  dropoff: { type: "string" },
                  confidence: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });

      return result.recommendations;
    },
    enabled: !!userEmail && pastRides.length > 0
  });

  if (isLoading || !recommendations || recommendations.length === 0) return null;

  const confidenceColors = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-gray-100 text-gray-800'
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Suggested Rides for You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{rec.pickup} → {rec.dropoff}</span>
                  </div>
                  <p className="text-xs text-gray-500">{rec.reason}</p>
                </div>
                <Badge className={confidenceColors[rec.confidence] || confidenceColors.medium}>
                  {rec.confidence}
                </Badge>
              </div>
              <Button
                onClick={() => onSelectRoute({ pickup: rec.pickup, dropoff: rec.dropoff })}
                size="sm"
                className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Book This Ride
              </Button>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}