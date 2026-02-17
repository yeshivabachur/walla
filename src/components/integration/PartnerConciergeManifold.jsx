import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Hotel, Utensils, Music, ShoppingBag, 
  MapPin, Star, Calendar, ExternalLink,
  ChevronRight, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const PARTNERS = [
  { id: 'p-01', type: 'HOTEL', name: 'Nexus Grand', deal: 'Early Check-in Authorized', icon: Hotel, color: 'text-blue-400' },
  { id: 'p-02', type: 'RESTAURANT', name: 'The Binary Bistro', deal: 'Priority Table Reserved', icon: Utensils, color: 'text-orange-400' },
  { id: 'p-03', type: 'CONCERT', name: 'Cyber-Arena', deal: 'VIP Entry Synced', icon: Music, color: 'text-pink-400' }
];

export default function PartnerConciergeManifold() {
  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Bespoke Partner Concierge</span>
          </div>
          <Badge className="bg-indigo-600">ELITE_ACCESS</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4 flex-1">
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-indigo-300 tracking-[0.2em]">Active Destination Synergies</h4>
          {PARTNERS.map(p => (
            <motion.div
              key={p.id}
              whileHover={{ x: 5 }}
              className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-indigo-500/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 ${p.color}`}>
                  <p.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase">{p.name}</p>
                  <p className="text-[8px] text-white/40 font-mono">{p.deal}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-indigo-400 transition-colors" />
            </motion.div>
          ))}
        </div>

        {/* Personal Shopper & Childcare integration concepts */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <p className="text-[9px] font-bold uppercase text-white">AI Shopper</p>
            <p className="text-[7px] text-white/40">In-Transit Pickup Ready</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
            <Star className="w-4 h-4 text-purple-400" />
            <p className="text-[9px] font-bold uppercase text-white">Trust-Childcare</p>
            <p className="text-[7px] text-white/40">Verified Escort Active</p>
          </div>
        </div>

        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] h-12 rounded-xl">
          Coordinate Global Itinerary
        </Button>
      </CardContent>
    </Card>
  );
}
