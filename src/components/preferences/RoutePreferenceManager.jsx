import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus } from 'lucide-react';

export default function RoutePreferenceManager({ userEmail }) {
  const queryClient = useQueryClient();
  const [selectedPrefs, setSelectedPrefs] = useState([]);

  const { data: preferences = [] } = useQuery({
    queryKey: ['routePreferences', userEmail],
    queryFn: () => base44.entities.RoutePreference.filter({ user_email: userEmail })
  });

  const options = [
    { value: 'scenic', label: '🌳 Scenic Routes' },
    { value: 'fastest', label: '⚡ Fastest' },
    { value: 'less_turns', label: '↗️ Fewer Turns' },
    { value: 'smoother_roads', label: '🛣️ Smoother Roads' },
    { value: 'avoid_tolls', label: '💰 Avoid Tolls' },
    { value: 'avoid_highways', label: '🚗 Avoid Highways' }
  ];

  const saveMutation = useMutation({
    mutationFn: async (prefs) => {
      for (const pref of prefs) {
        const existing = preferences.find(p => p.preference_type === pref);
        if (!existing) {
          await base44.entities.RoutePreference.create({
            user_email: userEmail,
            preference_type: pref,
            priority: 1
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['routePreferences']);
    }
  });

  const togglePref = (value) => {
    setSelectedPrefs(prev => 
      prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Route Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {options.map(opt => (
            <Badge
              key={opt.value}
              className={`cursor-pointer ${
                selectedPrefs.includes(opt.value)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => togglePref(opt.value)}
            >
              {opt.label}
            </Badge>
          ))}
        </div>
        <Button
          onClick={() => saveMutation.mutate(selectedPrefs)}
          disabled={saveMutation.isPending || selectedPrefs.length === 0}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}