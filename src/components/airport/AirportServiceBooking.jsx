import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plane, Crown, Luggage } from 'lucide-react';

export default function AirportServiceBooking({ onConfigChange }) {
  const [config, setConfig] = useState({
    flightNumber: '',
    terminal: '',
    meetGreet: false,
    luggageAssist: false,
    fastTrack: false,
    loungeAccess: false
  });

  const updateConfig = (updates) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="w-5 h-5 text-blue-600" />
          Airport Services
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Flight Number"
            value={config.flightNumber}
            onChange={(e) => updateConfig({ flightNumber: e.target.value })}
            className="rounded-xl"
          />
          <Input
            placeholder="Terminal"
            value={config.terminal}
            onChange={(e) => updateConfig({ terminal: e.target.value })}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between bg-white rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-600" />
              <span className="text-sm">Meet & Greet</span>
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">+$25</Badge>
            </div>
            <Switch checked={config.meetGreet} onCheckedChange={(v) => updateConfig({ meetGreet: v })} />
          </div>

          <div className="flex items-center justify-between bg-white rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Luggage className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Luggage Assistance</span>
              <Badge className="bg-blue-100 text-blue-800 text-xs">+$15</Badge>
            </div>
            <Switch checked={config.luggageAssist} onCheckedChange={(v) => updateConfig({ luggageAssist: v })} />
          </div>

          <div className="flex items-center justify-between bg-white rounded-xl p-3">
            <span className="text-sm">Fast Track Security</span>
            <Switch checked={config.fastTrack} onCheckedChange={(v) => updateConfig({ fastTrack: v })} />
          </div>

          <div className="flex items-center justify-between bg-white rounded-xl p-3">
            <span className="text-sm">Lounge Access</span>
            <Switch checked={config.loungeAccess} onCheckedChange={(v) => updateConfig({ loungeAccess: v })} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}