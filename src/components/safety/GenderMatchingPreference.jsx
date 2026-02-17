import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function GenderMatchingPreference({ userEmail }) {
  const [enabled, setEnabled] = useState(false);
  const [preference, setPreference] = useState('any');

  const savePreference = async () => {
    await base44.entities.GenderPreference.create({
      user_email: userEmail,
      preferred_driver_gender: preference,
      enabled: enabled
    });
    toast.success('Preference saved');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-blue-600" />
          Driver Matching
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Enable preference</span>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
        {enabled && (
          <Select value={preference} onValueChange={setPreference}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any driver</SelectItem>
              <SelectItem value="female">Female drivers</SelectItem>
              <SelectItem value="male">Male drivers</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button onClick={savePreference} className="w-full" size="sm">
          Save
        </Button>
      </CardContent>
    </Card>
  );
}