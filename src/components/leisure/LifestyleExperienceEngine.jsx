import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Flower2, Star, Book, 
  Smile, Zap, Compass, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EXPERIENCES = [
  { id: 'yoga', name: 'Interactive Yoga', icon: Flower2, color: 'text-pink-400', desc: 'Seat-based stretching & breathwork' },
  { id: 'star', name: 'Stargazing Mode', icon: Star, color: 'text-yellow-400', desc: 'Panoramic roof AR constellation overlay' },
  { id: 'comedy', name: 'Comedy Hour', icon: Smile, color: 'text-orange-400', desc: 'Live AI-generated local humor' },
  { id: 'book', name: 'Book Club Sync', icon: Book, color: 'text-indigo-400', desc: 'Shared audio narrative with fellow riders' }
];

export default function LifestyleExperienceEngine() {
  const [activeExp, setActiveExp] = useState(null);

  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-indigo-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Lifestyle Experience Manifold
          </div>
          <Badge className="bg-indigo-600">MODULAR_UX</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={exp.id}
              whileHover={{ y: -2 }}
              onClick={() => setActiveExp(exp)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${activeExp?.id === exp.id ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(79,70,229,0.2)]' : 'border-white/5 bg-white/5'}`}
            >
              <div className={`p-2 rounded-xl bg-white/5 ${exp.color} w-fit mb-3`}>
                <exp.icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight">{exp.name}</h4>
              <p className="text-[8px] text-white/40 mt-1 uppercase">{exp.desc}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {activeExp && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Initializing {activeExp.name}</span>
                <Badge variant="outline" className="text-[8px] border-white/10">ALPHA_MODULE</Badge>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed uppercase">
                Environmental parameters adjusting. Seat vibration, lighting wavelength, and cabin scent manifold synced to {activeExp.id} profile.
              </p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] h-10 rounded-xl">
                <Play className="w-3 h-3 mr-2" />
                Engage Experience
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2 pt-2">
          <Compass className="w-3 h-3 text-white/20" />
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Experiential Protocol v9.4.2</span>
        </div>
      </CardContent>
    </Card>
  );
}
