import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smile, Music, Sun, Moon, Heart, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const moodConfig = {
  energetic: {
    icon: Zap,
    color: 'bg-orange-100 text-orange-800',
    emoji: '⚡',
    music: 'Upbeat Pop, EDM',
    lighting: 'Bright & Dynamic',
    description: 'High energy vibes'
  },
  relaxed: {
    icon: Moon,
    color: 'bg-blue-100 text-blue-800',
    emoji: '🌙',
    music: 'Chill, Ambient',
    lighting: 'Soft & Warm',
    description: 'Calm and peaceful'
  },
  focused: {
    icon: Sun,
    color: 'bg-green-100 text-green-800',
    emoji: '🎯',
    music: 'Instrumental, Classical',
    lighting: 'Neutral & Clear',
    description: 'Work mode'
  },
  social: {
    icon: Users,
    color: 'bg-purple-100 text-purple-800',
    emoji: '🎉',
    music: 'Pop Hits, Dance',
    lighting: 'Colorful & Fun',
    description: 'Party vibes'
  },
  romantic: {
    icon: Heart,
    color: 'bg-pink-100 text-pink-800',
    emoji: '💕',
    music: 'Jazz, Soft Rock',
    lighting: 'Dim & Cozy',
    description: 'Date night'
  }
};

export default function MoodBasedCustomization({ userEmail }) {
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: rideMood } = useQuery({
    queryKey: ['rideMood', userEmail],
    queryFn: async () => {
      const moods = await base44.entities.RideMood.filter({ user_email: userEmail });
      if (moods[0]) return moods[0];
      
      return await base44.entities.RideMood.create({
        user_email: userEmail,
        current_mood: 'relaxed'
      });
    },
    enabled: !!userEmail
  });

  const updateMoodMutation = useMutation({
    mutationFn: async (mood) => {
      await base44.entities.RideMood.update(rideMood.id, {
        current_mood: mood,
        last_updated: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rideMood']);
      toast.success('Ride mood updated!');
    }
  });

  if (!rideMood) return null;

  const currentConfig = moodConfig[rideMood.current_mood];
  const CurrentIcon = currentConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-purple-600" />
              Ride Mood
            </span>
            <Badge className={currentConfig.color}>
              {currentConfig.emoji} {rideMood.current_mood}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-xl p-3">
            <div className="flex items-center gap-3 mb-2">
              <CurrentIcon className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{currentConfig.description}</p>
                <p className="text-xs text-gray-600">
                  <Music className="w-3 h-3 inline mr-1" />
                  {currentConfig.music}
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full"
          >
            {isExpanded ? 'Hide' : 'Change Mood'}
          </Button>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-2 gap-2"
            >
              {Object.entries(moodConfig).map(([mood, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={mood}
                    onClick={() => updateMoodMutation.mutate(mood)}
                    disabled={rideMood.current_mood === mood}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      rideMood.current_mood === mood
                        ? 'border-purple-500 bg-purple-100'
                        : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                    <p className="text-xs font-medium">{config.emoji} {mood}</p>
                  </button>
                );
              })}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}