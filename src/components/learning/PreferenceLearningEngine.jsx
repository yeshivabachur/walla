import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PreferenceLearningEngine({ userEmail }) {
  const [profile, setProfile] = useState(null);

  const { data: rides = [] } = useQuery({
    queryKey: ['preferenceRides', userEmail],
    queryFn: () => base44.entities.RideRequest.filter({
      passenger_email: userEmail,
      status: 'completed'
    }, '-created_date', 20)
  });

  useEffect(() => {
    if (rides.length < 5) return;

    const learnPreferences = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Learn passenger preferences from ride history.

Total rides: ${rides.length}
Common routes: ${rides.slice(0, 5).map(r => `${r.pickup_location} → ${r.dropoff_location}`).join(', ')}

Infer:
1. Temperature preference
2. Music preference
3. Conversation style
4. Route preference
5. Morning destinations (top 2)
6. Evening destinations (top 2)
7. Overall comfort score (0-100)`,
        response_json_schema: {
          type: 'object',
          properties: {
            learned_preferences: {
              type: 'object',
              properties: {
                preferred_temperature: { type: 'string' },
                music_preference: { type: 'string' },
                conversation_style: { type: 'string' },
                route_preference: { type: 'string' }
              }
            },
            time_patterns: {
              type: 'object',
              properties: {
                morning_destinations: { type: 'array', items: { type: 'string' } },
                evening_destinations: { type: 'array', items: { type: 'string' } }
              }
            },
            comfort_score: { type: 'number' }
          }
        }
      });

      setProfile(result);

      await base44.entities.PassengerPreferenceProfile.create({
        user_email: userEmail,
        learned_preferences: result.learned_preferences,
        time_patterns: result.time_patterns,
        comfort_score: result.comfort_score
      });
    };

    learnPreferences();
  }, [rides, userEmail]);

  if (!profile) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Learned Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">Comfort Match</span>
              <span className="text-lg font-bold text-purple-600">{profile.comfort_score}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${profile.comfort_score}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {Object.entries(profile.learned_preferences || {}).map(([key, value]) => (
              <div key={key} className="bg-white rounded-lg p-2 flex items-center gap-2">
                <ThumbsUp className="w-3 h-3 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</p>
                  <p className="text-xs font-semibold text-gray-900">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <p className="text-xs text-purple-800">
              💡 Drivers will receive your preferences for a personalized experience
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}