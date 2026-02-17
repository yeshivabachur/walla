import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Heart, Sparkles, Music, Wind } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const activities = [
  { id: 'meditation', label: 'Guided Meditation', icon: '🧘' },
  { id: 'breathing', label: 'Breathing Exercises', icon: '🫁' },
  { id: 'relaxing_music', label: 'Relaxing Music', icon: '🎵' },
  { id: 'nature_sounds', label: 'Nature Sounds', icon: '🌲' },
  { id: 'silence', label: 'Peaceful Silence', icon: '🤫' }
];

export default function WellnessRideMode({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: wellness } = useQuery({
    queryKey: ['wellness', userEmail],
    queryFn: async () => {
      const profiles = await base44.entities.WellnessMode.filter({ user_email: userEmail });
      if (profiles[0]) return profiles[0];
      
      return await base44.entities.WellnessMode.create({
        user_email: userEmail,
        enabled: false,
        preferred_activities: []
      });
    },
    enabled: !!userEmail
  });

  const toggleMutation = useMutation({
    mutationFn: async (enabled) => {
      await base44.entities.WellnessMode.update(wellness.id, { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wellness']);
      toast.success('Wellness mode updated');
    }
  });

  const updateActivitiesMutation = useMutation({
    mutationFn: async (activities) => {
      await base44.entities.WellnessMode.update(wellness.id, { 
        preferred_activities: activities 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wellness']);
    }
  });

  if (!wellness) return null;

  const toggleActivity = (activityId) => {
    const current = wellness.preferred_activities || [];
    const updated = current.includes(activityId)
      ? current.filter(a => a !== activityId)
      : [...current, activityId];
    updateActivitiesMutation.mutate(updated);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-600" />
              Wellness Mode
            </span>
            <Switch
              checked={wellness.enabled}
              onCheckedChange={(checked) => toggleMutation.mutate(checked)}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {wellness.enabled && (
            <>
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-semibold text-gray-900">Your Preferences</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {activities.map((activity) => (
                    <Button
                      key={activity.id}
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActivity(activity.id)}
                      className={`rounded-lg justify-start ${
                        wellness.preferred_activities?.includes(activity.id)
                          ? 'bg-purple-100 border-purple-300'
                          : ''
                      }`}
                    >
                      <span className="mr-2">{activity.icon}</span>
                      <span className="text-xs">{activity.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {wellness.streak_days > 0 && (
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600 mb-1">
                    {wellness.streak_days} Day Streak! 🎯
                  </p>
                  <p className="text-xs text-gray-600">
                    Keep your wellness journey going
                  </p>
                </div>
              )}

              <p className="text-xs text-center text-gray-600">
                Your driver will be notified of your wellness preferences for a more mindful ride experience.
              </p>
            </>
          )}

          {!wellness.enabled && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 mb-2">
                Turn your commute into a moment of mindfulness
              </p>
              <p className="text-xs text-gray-500">
                Guided meditation, breathing exercises, and calming music
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}