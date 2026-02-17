import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dna, Fingerprint, Biohazard, Atom, 
  ShieldCheck, Activity, Database, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function BiologicalSovereigntyHub({ userEmail }) {
  return (
    <Card className="border border-pink-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-pink-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dna className="w-4 h-4 text-pink-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Biological & DNA Sovereignty</span>
          </div>
          <Badge className="bg-pink-600">DNA_LINK_ACTIVE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {/* DNA-based Personalization */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-pink-300 italic">Molecular Preference Manifold</h4>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-white/40">Genomic Alignment</span>
              <span className="text-pink-400">99.92%</span>
            </div>
            <div className="flex gap-0.5 h-4">
              {[1,4,2,8,5,3,9,4,2,6].map((h, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [`${h*10}%`, `${Math.random()*100}%`, `${h*10}%`] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex-1 bg-pink-500/40 rounded-sm"
                />
              ))}
            </div>
            <p className="text-[8px] text-white/60 uppercase leading-relaxed">
              Cabin environment (O2 levels, lighting wavelength, and seat molecular density) adjusted to match your unique genetic markers.
            </p>
          </div>
        </div>

        {/* Atomic Precision */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
            <Atom className="w-5 h-5 text-cyan-400" />
            <p className="text-[10px] font-black uppercase text-white">Atomic Accuracy</p>
            <p className="text-[7px] text-white/40">Sub-nanometer positioning</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
            <Biohazard className="w-5 h-5 text-green-400" />
            <p className="text-[10px] font-black uppercase text-white">Bio-Sanitation</p>
            <p className="text-[7px] text-white/40">Cellular-level cleansing</p>
          </div>
        </div>

        <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black uppercase text-[10px] h-12 rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.3)]">
          Re-sequence Cabin Manifold
        </Button>

        <div className="flex items-center justify-between text-[8px] font-mono text-white/20 mt-2 uppercase">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" />
            <span>Genomic Privacy: Locked</span>
          </div>
          <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
