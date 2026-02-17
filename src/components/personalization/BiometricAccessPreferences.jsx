import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Fingerprint, Wind, Baby, Luggage, 
  Venus, ShieldCheck, Zap, Mic
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function BiometricAccessPreferences({ userEmail }) {
  const [prefs, setPrefs] = useState({
    biometric_entry: true,
    scent: 'Neutral',
    luggage: 'Standard',
    female_driver: false
  });

  return (
    <Card className="border border-cyan-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-cyan-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-cyan-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Biometric Access & Cabin</span>
          </div>
          <Badge className="bg-cyan-600 text-[10px]">SYNCED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase">Voice Biometrics</span>
              <span className="text-[8px] text-white/40">Secured Layer</span>
            </div>
            <Mic className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase">Gender Match</span>
              <span className="text-[8px] text-white/40">{prefs.female_driver ? 'ACTIVE' : 'OFF'}</span>
            </div>
            <Venus className="w-4 h-4 text-pink-400" />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-indigo-300">Cabin Preferences</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Wind className="w-4 h-4 text-white/60" />
                <span className="text-[10px] uppercase font-mono">Ambient Scent Manifold</span>
              </div>
              <Badge variant="outline" className="text-[8px] border-white/10">{prefs.scent}</Badge>
            </div>
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Luggage className="w-4 h-4 text-white/60" />
                <span className="text-[10px] uppercase font-mono">Cargo Capacity Optimization</span>
              </div>
              <Badge variant="outline" className="text-[8px] border-white/10">{prefs.luggage}</Badge>
            </div>
          </div>
        </div>

        <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-black uppercase text-[10px] h-12 rounded-xl">
          Apply Neural Cabin Presets
        </Button>

        <div className="flex items-center gap-2 text-[8px] text-white/40 uppercase font-mono justify-center mt-2">
          <ShieldCheck className="w-3 h-3 text-green-400" />
          Hardware Level Encryption Active
        </div>
      </CardContent>
    </Card>
  );
}
