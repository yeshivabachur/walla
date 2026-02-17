import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, MessageCircle } from 'lucide-react';

export default function RideModeSelector({ userEmail, onModeSelect }) {
  const [selected, setSelected] = useState('default');

  const modes = [
    { value: 'quiet', label: 'Quiet Mode', icon: VolumeX, desc: 'Peaceful, silent ride' },
    { value: 'default', label: 'Default', icon: Volume2, desc: 'Normal interaction' },
    { value: 'talkative', label: 'Talkative', icon: MessageCircle, desc: 'Friendly conversation' }
  ];

  const selectMode = async (mode) => {
    setSelected(mode);
    
    await base44.entities.RideMode.create({
      user_email: userEmail,
      mode: mode,
      auto_apply: true
    });

    onModeSelect?.(mode);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ride Atmosphere</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {modes.map(mode => {
          const Icon = mode.icon;
          return (
            <Button
              key={mode.value}
              variant={selected === mode.value ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => selectMode(mode.value)}
            >
              <Icon className="w-4 h-4 mr-3" />
              <div className="text-left">
                <div className="font-semibold">{mode.label}</div>
                <div className="text-xs opacity-70">{mode.desc}</div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}