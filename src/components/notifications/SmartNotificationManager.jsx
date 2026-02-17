import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function SmartNotificationManager({ userEmail }) {
  const [prefs, setPrefs] = useState({
    push: true,
    email: true,
    sms: false,
    promotions: false,
    ride_updates: true,
    safety_alerts: true
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.SmartNotificationPreference.create({
        user_email: userEmail,
        channels: {
          push: prefs.push,
          email: prefs.email,
          sms: prefs.sms
        },
        categories: {
          promotions: prefs.promotions,
          ride_updates: prefs.ride_updates,
          safety_alerts: prefs.safety_alerts
        }
      });
    },
    onSuccess: () => {
      toast.success('Notification preferences saved');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bell className="w-4 h-4 text-blue-600" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Push notifications</span>
            <Switch checked={prefs.push} onCheckedChange={(v) => setPrefs({...prefs, push: v})} />
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Email</span>
            <Switch checked={prefs.email} onCheckedChange={(v) => setPrefs({...prefs, email: v})} />
          </div>
          <div className="flex justify-between">
            <span className="text-sm">SMS</span>
            <Switch checked={prefs.sms} onCheckedChange={(v) => setPrefs({...prefs, sms: v})} />
          </div>
        </div>
        <div className="border-t pt-2 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Promotions</span>
            <Switch checked={prefs.promotions} onCheckedChange={(v) => setPrefs({...prefs, promotions: v})} />
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Ride updates</span>
            <Switch checked={prefs.ride_updates} onCheckedChange={(v) => setPrefs({...prefs, ride_updates: v})} />
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Safety alerts</span>
            <Switch checked={prefs.safety_alerts} onCheckedChange={(v) => setPrefs({...prefs, safety_alerts: v})} />
          </div>
        </div>
        <Button onClick={() => saveMutation.mutate()} className="w-full" size="sm">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}