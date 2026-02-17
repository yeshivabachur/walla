import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Globe2, Heart, Users, ShieldCheck, 
  MapPin, Languages, Star, Scale
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CulturalInclusionManifold({ userEmail }) {
  return (
    <Card className="border border-purple-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-purple-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-purple-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Inclusion & Multi-Cultural Hub</span>
          </div>
          <Badge className="bg-purple-600">INCLUSIVE_DESIGN</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <Languages className="w-5 h-5 text-cyan-400" />
            <p className="text-[10px] font-black uppercase">Language Matching</p>
            <p className="text-[8px] text-white/40 italic">Sync with 12+ Dialects</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <Scale className="w-5 h-5 text-green-400" />
            <p className="text-[10px] font-black uppercase">Pay Equity Audit</p>
            <p className="text-[8px] text-white/40 italic">Global Parity: 100%</p>
          </div>
        </div>

        {/* Religious & Special Accommodations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-purple-300">Religious & Lifestyle Presets</h4>
          <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase">Sabbath/Holiday Mode</span>
              <Badge variant="outline" className="text-[8px] border-purple-500/30 text-purple-400">AVAILABLE</Badge>
            </div>
            <p className="text-[8px] text-white/60 uppercase leading-relaxed">
              Automatic route adjustments and driver matching for observant passengers and religious landmarks.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-indigo-300">Representation Metrics</h4>
          <div className="flex gap-1 h-4">
            {[70, 85, 40, 90, 65].map((h, i) => (
              <div key={i} className="flex-1 bg-white/5 rounded-sm overflow-hidden flex items-end">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="w-full bg-indigo-500" 
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase">
            <span>Ethnicity</span>
            <span>Gender</span>
            <span>Neurodiversity</span>
          </div>
        </div>

        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black uppercase text-[10px] h-12 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          Configure Inclusive Profile
        </Button>
      </CardContent>
    </Card>
  );
}
