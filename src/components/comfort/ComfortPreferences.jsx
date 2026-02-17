import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Wind, Music, MessageCircle, Sun, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ComfortPreferences({ userEmail }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['comfortProfile', userEmail],
    queryFn: async () => {
      let profiles = await base44.entities.ComfortProfile.filter({ user_email: userEmail });
      if (profiles.length === 0) {
        return await base44.entities.ComfortProfile.create({
          user_email: userEmail,
          temperature_preference: 72,
          music_preference: 'driver_choice',
          conversation_level: 'friendly',
          window_preference: 'no_preference',
          fragrance_preference: 'light',
          lighting_preference: 'auto'
        });
      }
      return profiles[0];
    },
    enabled: !!userEmail
  });

  const [temp, setTemp] = useState(profile?.temperature_preference || 72);
  const [music, setMusic] = useState(profile?.music_preference || 'driver_choice');
  const [conversation, setConversation] = useState(profile?.conversation_level || 'friendly');

  const updateMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.ComfortProfile.update(profile.id, {
        temperature_preference: temp,
        music_preference: music,
        conversation_level: conversation
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comfortProfile']);
      setIsEditing(false);
      toast.success('Preferences updated!');
    }
  });

  if (!profile) return null;

  return (
    <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Comfort Profile
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Wind className="w-4 h-4 text-purple-600" />
              Temperature
            </span>
            <span className="text-sm text-purple-600">{temp}°F</span>
          </div>
          {isEditing ? (
            <Slider
              value={[temp]}
              onValueChange={([value]) => setTemp(value)}
              min={65}
              max={78}
              step={1}
            />
          ) : (
            <div className="h-2 bg-purple-200 rounded-full">
              <div 
                className="h-full bg-purple-600 rounded-full" 
                style={{ width: `${((temp - 65) / 13) * 100}%` }}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Music</span>
          </div>
          {isEditing ? (
            <Select value={music} onValueChange={setMusic}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No music</SelectItem>
                <SelectItem value="soft">Soft background</SelectItem>
                <SelectItem value="upbeat">Upbeat</SelectItem>
                <SelectItem value="driver_choice">Driver's choice</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-gray-600 capitalize">{music.replace('_', ' ')}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Conversation</span>
          </div>
          {isEditing ? (
            <Select value={conversation} onValueChange={setConversation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quiet">Prefer quiet</SelectItem>
                <SelectItem value="friendly">Friendly chat</SelectItem>
                <SelectItem value="chatty">Love to talk</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-gray-600 capitalize">{conversation}</p>
          )}
        </div>

        {isEditing && (
          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Save Preferences
          </Button>
        )}
      </CardContent>
    </Card>
  );
}