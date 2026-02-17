import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Volume2, Mic2, Music, Waves, 
  MapPin, Radio, Bell, Heart,
  Fingerprint, Sparkles, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SonicBrandingManifold() {
  const [voice, setVoice] = useState('Imperial');

  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-indigo-400">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Sonic Branding & Voice OS
          </div>
          <Badge className="bg-indigo-600 animate-pulse">SONIC_SYNC</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {/* Audio Logo Section */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Master Audio Logo</span>
            </div>
            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-black h-7 text-[8px] font-black rounded-lg uppercase">
              Play Walla ID
            </Button>
          </div>
          <div className="h-12 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
            <div className="flex gap-1 items-center">
              {[1,4,2,8,5,3,9,4,2,6,8,3,5,1].map((h, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [`${h*5}%`, `${Math.random()*100}%`, `${h*5}%`] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                  className="w-1 bg-yellow-400/40 rounded-full" 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Voice Personality Selector */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-indigo-300 italic">AI Voice Personality</h4>
          <div className="grid grid-cols-2 gap-3">
            {['Imperial', 'Zen_Flow', 'Casual_Logic', 'Direct_Pilot'].map(v => (
              <div 
                key={v}
                onClick={() => setVoice(v)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${voice === v ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5'}`}
              >
                <div className="flex items-center gap-2">
                  <Mic2 className={`w-3 h-3 ${voice === v ? 'text-indigo-400' : 'text-white/20'}`} />
                  <span className="text-[9px] font-bold uppercase">{v}</span>
                </div>
                {voice === v && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Audio Landmarks */}
        <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Audio Landmarks</span>
          </div>
          <p className="text-[8px] text-white/60 leading-relaxed uppercase">
            "We're crossing the Bay Bridge. Historical data manifold initialized. Listen to the 1936 echo?"
          </p>
          <Button className="w-full bg-white text-black font-black uppercase text-[8px] h-8 rounded-lg">
            Initialize Sonic Layer
          </Button>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-white/5 font-mono text-[8px] text-white/20">
          <div className="flex items-center gap-2 uppercase">
            <Radio className="w-3 h-3 text-cyan-400" />
            Channel: STEREO_POSITIONAL
          </div>
          <span className="uppercase">Haptics: SYNCED</span>
        </div>
      </CardContent>
    </Card>
  );
}
