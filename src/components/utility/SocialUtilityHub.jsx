import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, HeartHandshake, Umbrella, Wind, 
  Newspaper, Users, HelpCircle, GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

const UTILITIES = [
  { id: 'tutoring', name: 'Tutoring Packages', icon: GraduationCap, color: 'text-blue-400', desc: 'School & Activity coordination' },
  { id: 'donation', name: 'Blood Donation Support', icon: HeartHandshake, color: 'text-red-400', desc: 'Free rides for donors' },
  { id: 'umbrella', name: 'Umbrella Lending', icon: Umbrella, color: 'text-cyan-400', desc: 'Active in 42% of fleet' },
  { id: 'scent', name: 'Scent-Free Verified', icon: Wind, color: 'text-green-400', desc: 'Fragrance-free vehicle match' }
];

export default function SocialUtilityHub() {
  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Social Utility & Niche Hub</span>
          </div>
          <Badge className="bg-indigo-600">COMMUNITY_DRIVEN</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {UTILITIES.map((u, i) => (
            <motion.div
              key={u.id}
              whileHover={{ y: -2 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all group"
            >
              <div className={`p-2 rounded-xl bg-white/5 ${u.color} w-fit mb-3`}>
                <u.icon className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-tight">{u.name}</h4>
              <p className="text-[8px] text-white/40 mt-1 uppercase">{u.desc}</p>
              <Button size="sm" className="w-full mt-4 bg-white/5 hover:bg-white/10 text-[8px] h-8 rounded-lg uppercase font-bold">
                Configure Service
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-black uppercase">In-Ride Media Portal</span>
          </div>
          <p className="text-[8px] text-white/60 leading-relaxed uppercase">
            Newspapers, Magazines, and 8K Digital Feeds available in your specific cabin.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
