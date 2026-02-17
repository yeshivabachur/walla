import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FlaskConical, Vote, Users, MessageSquare, 
  Lightbulb, Rocket, Globe, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LAB_PROJECTS = [
  { id: 'lb-01', name: 'Teleportation Pre-Book', status: 'Experimental', votes: 420 },
  { id: 'lb-02', name: 'Inter-City Wormholes', status: 'Concept', votes: 892 },
  { id: 'lb-03', name: 'Neural-Ride Feedback', status: 'Beta', votes: 142 },
];

export default function InnovationLabsManifold() {
  return (
    <Card className="border border-cyan-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-cyan-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Innovation Labs & Voting</span>
          </div>
          <Badge className="bg-cyan-600 animate-pulse">LABS_LIVE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-cyan-300">Community Roadmap Voting</h4>
          <div className="space-y-2">
            {LAB_PROJECTS.map(proj => (
              <div key={proj.id} className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <Lightbulb className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase">{proj.name}</p>
                    <Badge variant="outline" className="text-[6px] border-white/10 py-0">{proj.status}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-400">{proj.votes}</span>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-cyan-500/20">
                    <Vote className="w-4 h-4 text-cyan-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Beta Enrollment */}
        <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black uppercase">Alpha Access Program</span>
          </div>
          <p className="text-[8px] text-white/60 uppercase">
            Be the first to test our <strong>Quantum Entanglement</strong> navigation protocol.
          </p>
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-10 rounded-xl font-black uppercase text-[10px]">
            Enroll in Alpha Manifold
          </Button>
        </div>

        <div className="flex items-center justify-between text-[8px] font-mono text-white/20 mt-2 uppercase">
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3" />
            <span>Community Contributors: 12.4k</span>
          </div>
          <div className="flex items-center gap-1 text-cyan-400">
            <Zap className="w-3 h-3" />
            <span>IDEATION_ACTIVE</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
