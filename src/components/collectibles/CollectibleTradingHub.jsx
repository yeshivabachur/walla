import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, Gift, Repeat, Star, 
  Sparkles, Package, Users, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RARE_ITEMS = [
  { id: 'itm-01', name: 'Alpha-Route Fragment', rarity: 'LEGENDARY', price: 4200, color: 'text-yellow-400' },
  { id: 'itm-02', name: 'Neural-Sync Core', rarity: 'EPIC', price: 1200, color: 'text-purple-400' },
];

export default function CollectibleTradingHub() {
  return (
    <Card className="border border-purple-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-purple-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Rare Collectibles & Trading</span>
          </div>
          <Badge className="bg-purple-600">TRADING_OPEN</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase text-purple-300 italic">Inventory Manifold</h4>
            <span className="text-[10px] font-mono text-white/40">2/100 SLOTS</span>
          </div>
          {RARE_ITEMS.map(item => (
            <div key={item.id} className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Star className={`w-4 h-4 ${item.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase">{item.name}</p>
                  <p className={`text-[8px] font-mono ${item.color}`}>{item.rarity}</p>
                </div>
              </div>
              <Button size="sm" className="bg-purple-600/20 hover:bg-purple-600 text-purple-100 text-[8px] h-7 rounded-lg">
                Trade Node
              </Button>
            </div>
          ))}
        </div>

        {/* Gifting Section */}
        <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Global Gifting Manifold</span>
          </div>
          <p className="text-[8px] text-white/60 leading-relaxed uppercase italic">
            "Surprise a fellow rider with a Nitro-Boost or a Carbon-Credit."
          </p>
          <div className="flex gap-2">
            <Button className="flex-1 bg-white/5 border border-white/10 h-10 rounded-xl text-[8px] font-bold">GIFT_NITRO</Button>
            <Button className="flex-1 bg-white/5 border border-white/10 h-10 rounded-xl text-[8px] font-bold">GIFT_ZEN</Button>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-white/5">
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-white/40" />
            <span className="text-[8px] font-mono text-white/40 uppercase">Active Traders: 142</span>
          </div>
          <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
