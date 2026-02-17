import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PersonalizedRecommendations({ userEmail }) {
  const [recommendations, setRecommendations] = useState(null);
  const navigate = useNavigate();

  const { data: rideHistory = [] } = useQuery({
    queryKey: ['userRideHistory', userEmail],
    queryFn: () => base44.entities.RideRequest.filter({
      passenger_email: userEmail,
      status: 'completed'
    }, '-created_date', 20)
  });

  useEffect(() => {
    if (rideHistory.length < 3) return;

    const generateRecommendations = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate personalized ride recommendations based on user history.

Ride count: ${rideHistory.length}
Current time: ${new Date().toLocaleString()}
Day: ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}

Provide 2 smart suggestions:
1. Based on time/location patterns
2. Based on upcoming needs

Each with: title, description, pickup, dropoff, timing tip`,
        response_json_schema: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  pickup: { type: 'string' },
                  dropoff: { type: 'string' },
                  timing_tip: { type: 'string' }
                }
              }
            }
          }
        }
      });

      setRecommendations(result);
    };

    generateRecommendations();
  }, [rideHistory]);

  if (!recommendations?.suggestions?.length) return null;

  const bookRide = (suggestion) => {
    navigate(createPageUrl('RequestRide'), {
      state: {
        pickup_location: suggestion.pickup,
        dropoff_location: suggestion.dropoff
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.suggestions.map((suggestion, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-3"
            >
              <p className="font-semibold text-sm text-gray-900 mb-1">
                {suggestion.title}
              </p>
              <p className="text-xs text-gray-600 mb-2">
                {suggestion.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <MapPin className="w-3 h-3" />
                <span>{suggestion.pickup} → {suggestion.dropoff}</span>
              </div>

              {suggestion.timing_tip && (
                <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 rounded p-2 mb-2">
                  <Clock className="w-3 h-3" />
                  <span>{suggestion.timing_tip}</span>
                </div>
              )}

              <Button
                onClick={() => bookRide(suggestion)}
                size="sm"
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Book Now
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}