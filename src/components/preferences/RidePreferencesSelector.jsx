import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Thermometer } from 'lucide-react';

export default function RidePreferencesSelector({ onPreferencesChange }) {
  const [prefs, setPrefs] = useState({
    silent_mode: false,
    temperature: 72,
    music_genre: 'none'
  });

  const updatePref = (key, value) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    onPreferencesChange?.(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Ride Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={prefs.silent_mode}
            onCheckedChange={(checked) => updatePref('silent_mode', checked)}
          />
          <label className="text-sm">Silent Mode (No conversation)</label>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs text-gray-600 flex items-center gap-1">
            <Thermometer className="w-3 h-3" />
            Temperature Preference (°F)
          </label>
          <Input
            type="number"
            value={prefs.temperature}
            onChange={(e) => updatePref('temperature', parseInt(e.target.value))}
            min="60"
            max="85"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-600 flex items-center gap-1">
            <Volume2 className="w-3 h-3" />
            Music Preference
          </label>
          <Select value={prefs.music_genre} onValueChange={(v) => updatePref('music_genre', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Music</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="rock">Rock</SelectItem>
              <SelectItem value="jazz">Jazz</SelectItem>
              <SelectItem value="classical">Classical</SelectItem>
              <SelectItem value="country">Country</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}