import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Music, Brain, HelpCircle, Utensils, 
  Zap, Trophy, Play, Radio, Mic2
} from 'lucide-react';
import { motion } from 'framer-motion';

const MODULES = [
  { id: 'music', name: 'Music Production', icon: Music, color: 'text-purple-400', desc: 'AI-assisted beat making in-cabin' },
  { id: 'trivia', name: 'Interactive Trivia', icon: HelpCircle, color: 'text-yellow-400', desc: 'Global leaderboard tournaments' },
  { id: 'cooking', name: 'Digital Cooking', icon: Utensils, color: 'text-orange-400', desc: 'Holographic meal prep mastery' },
  { id: 'cog', name: 'Cognitive Drills', icon: Brain, color: 'text-blue-400', desc: 'Neural link performance training' }
];

export default function EdutainmentManifold() {
  return (
    <Card className="border border-purple-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-purple-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-purple-400">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Edu-tainment & Gamified Learning
          </div>
          <Badge className="bg-purple-600 animate-pulse">MASTERY_TRACKING_ON</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="grid grid-cols-2 gap-4">
          {MODULES.map(m => (
            <div key={m.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3 group hover:bg-purple-500/10 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <m.icon className={`w-5 h-5 ${m.color} group-hover:scale-110 transition-transform`} />
                <Badge variant="outline" className="text-[6px] border-white/10">READY</Badge>
              </div>
              <h4 className="text-[10px] font-black uppercase text-white">{m.name}</h4>
              <p className="text-[7px] text-white/40 uppercase leading-tight">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Live Tournament Concept */}
        <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Global Ride Tournament</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-white/60 uppercase">Active Trivia Duel</span>
            <span className="text-purple-400 font-bold">#42 vs #102</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden flex gap-1">
            <div className="bg-purple-500 w-[42%]" />
            <div className="bg-cyan-500 w-[58%]" />
          </div>
        </div>

        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black uppercase text-[10px] h-12 rounded-xl">
          <Mic2 className="w-4 h-4 mr-2" />
          Enter Music Pod
        </Button>
      </CardContent>
    </Card>
  );
}
