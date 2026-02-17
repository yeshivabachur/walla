import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Volume2, Mic2, Music, Waves, 
  Hand, Eye, Fingerprint, Brain,
  Sparkles, Zap, Radio, Bell, 
  Languages, Search, Command
} from 'lucide-react';
import { motion } from 'framer-motion';

const ACCESSIBILITY_FEATURES = [
  { id: 'mls', name: 'Multilingual Support', icon: Languages, desc: 'Real-time 142-language translation' },
  { id: 'sls', name: 'Sign Language Support', icon: Hand, desc: 'Visual gesture-to-speech manifold' },
  { id: 'src', name: 'Screen Reader', icon: Eye, desc: 'High-fidelity audio-tactile interface' },
  { id: 'vcs', name: 'Voice Control', icon: Mic2, desc: 'Natural language system command' },
  { id: 'gcs', name: 'Gesture Control', icon: Zap, desc: 'Sub-millimeter hand tracking' },
  { id: 'ets', name: 'Eye Tracking', icon: Eye, desc: 'Gaze-driven interface navigation' },
  { id: 'hfs', name: 'Haptic Feedback', icon: Waves, desc: 'Positional vibrational cues' },
  { id: 'acs', name: 'Audio Cue System', icon: Bell, desc: 'Spatial directional landmarks' }
];

export default function NeuralAccessibilityHub() {
  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-indigo-400">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 animate-pulse" />
            Neural Accessibility & UX Sovereignty
          </div>
          <Badge className="bg-indigo-600">UNIVERSAL_DESIGN</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACCESSIBILITY_FEATURES.map(feat => (
            <div key={feat.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3 group hover:bg-indigo-500/10 transition-all cursor-pointer">
              <div className="p-2 rounded-xl bg-white/5 text-indigo-400 w-fit">
                <feat.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-tight">{feat.name}</h4>
                <p className="text-[7px] text-white/40 uppercase mt-1 leading-tight">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Specialized Modes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 text-center group hover:border-indigo-500/30 transition-all">
            <p className="text-[10px] font-black uppercase text-white/80">Senior Friendly</p>
            <p className="text-[7px] text-white/40 uppercase">High Contrast + Scale</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 text-center group hover:border-indigo-500/30 transition-all">
            <p className="text-[10px] font-black uppercase text-white/80">Child Safe Mode</p>
            <p className="text-[7px] text-white/40 uppercase">Content Filtering Active</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 text-center group hover:border-indigo-500/30 transition-all">
            <p className="text-[10px] font-black uppercase text-white/80">Color Blind Mode</p>
            <p className="text-[7px] text-white/40 uppercase">Deuteranopia Optimized</p>
          </div>
        </div>

        <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Tactile Indicators & Braille Sync</span>
          </div>
          <p className="text-[8px] text-white/60 leading-relaxed uppercase">
            "Dynamic tactile surfaces are reconfiguring to provide Braille labeling for all in-cabin controls."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
