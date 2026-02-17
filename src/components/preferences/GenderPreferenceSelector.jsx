import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from 'lucide-react';
import { toast } from 'sonner';

export default function GenderPreferenceSelector({ userEmail }) {
  const [gender, setGender] = useState('any');
  const [nightOnly, setNightOnly] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.GenderPreferenceMatch.create({
        user_email: userEmail,
        preferred_driver_gender: gender,
        time_of_day_preference: {
          night_rides_only: nightOnly,
          always: !nightOnly
        },
        enabled: gender !== 'any'
      });
    },
    onSuccess: () => {
      toast.success('Preference saved');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-purple-600" />
          Driver Gender Preference
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">No Preference</SelectItem>
            <SelectItem value="female">Female Driver</SelectItem>
            <SelectItem value="male">Male Driver</SelectItem>
            <SelectItem value="non-binary">Non-Binary Driver</SelectItem>
          </SelectContent>
        </Select>
        {gender !== 'any' && (
          <div className="flex items-center gap-2">
            <Checkbox checked={nightOnly} onCheckedChange={setNightOnly} />
            <label className="text-sm">Night rides only</label>
          </div>
        )}
        <Button onClick={() => saveMutation.mutate()} className="w-full" size="sm">
          Save Preference
        </Button>
      </CardContent>
    </Card>
  );
}