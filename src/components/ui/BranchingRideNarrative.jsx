import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, CornerUpRight, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NARRATIVES = {
  START: {
    text: "The vehicle merges into the quantum slipstream. You sense a disturbance in the localized gravity manifold. Do you investigate the anomaly or proceed with standard mission parameters?",
    choices: [
      { text: "Investigate Anomaly", next: "ANOMALY" },
      { text: "Standard Parameters", next: "STANDARD" }
    ]
  },
  ANOMALY: {
    text: "You focus your neural link on the anomaly. It's a localized sub-space fold. By tapping into it, you could save 12 minutes, but risk a temporal drift. Proceed?",
    choices: [
      { text: "Fold Spacetime", next: "FOLD" },
      { text: "Abort Investigation", next: "STANDARD" }
    ]
  },
  STANDARD: {
    text: "The ride continues smoothly. The AI co-pilot hums a low-frequency Imperial anthem. You arrive precisely on time.",
    choices: [
      { text: "Restart Simulation", next: "START" }
    ]
  },
  FOLD: {
    text: "Success. You've arrived 5 minutes BEFORE you left. The multiverse thanks you for your boldness.",
    choices: [
      { text: "Restart Simulation", next: "START" }
    ]
  }
};

export default function BranchingRideNarrative() {
  const [currentKey, setCurrentKey] = useState('START');
  const node = NARRATIVES[currentKey];

  return (
    <Card className="border border-purple-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-purple-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-purple-400">
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Interactive Ride Narrative
          </span>
          <Badge className="bg-purple-600 animate-pulse">STORY_MODE_ACTIVE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <p className="text-sm leading-relaxed text-gray-300 italic font-serif">
              "{node.text}"
            </p>

            <div className="grid grid-cols-1 gap-3">
              {node.choices.map((choice, i) => (
                <Button
                  key={i}
                  variant="outline"
                  onClick={() => setCurrentKey(choice.next)}
                  className="bg-white/5 border-white/10 hover:bg-purple-500/20 text-white h-12 rounded-xl flex items-center justify-between group px-4"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">{choice.text}</span>
                  <CornerUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </Button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-white/20">
          <span>Simulation Engine: Branch_v4.2</span>
          <span>Node_Address: {currentKey}</span>
        </div>
      </CardContent>
    </Card>
  );
}
