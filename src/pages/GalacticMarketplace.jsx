import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, Tag, Package, Sparkles, 
  ArrowRight, Coins, Zap, ShieldCheck,
  Star, Heart, Gem
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MARKET_ITEMS = [
  { id: 'm-01', name: 'Walla-Branded Neural Hoodie', type: 'GEAR', price: 1420, icon: ShoppingBag, color: 'text-indigo-400' },
  { id: 'm-02', name: 'FTL Engine Decal', type: 'ACCESSORY', price: 890, icon: Zap, color: 'text-yellow-400' },
  { id: 'm-03', name: 'Rare Carbon Credits', type: 'IMPACT', price: 2500, icon: Heart, color: 'text-green-400' },
  { id: 'm-04', name: 'Legacy Badge NFT', type: 'COLLECTIBLE', price: 12000, icon: Gem, color: 'text-purple-400' }
];

export default function GalacticMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.1),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-8 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic flex items-center gap-4 text-indigo-400">
              <ShoppingBag className="w-12 h-12" />
              Galactic Marketplace
            </h1>
            <p className="text-white/40 font-mono text-sm mt-2 uppercase">Official Branded Gear & Digital Artifact Manifold</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-xl">
              <Coins className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-[10px] text-white/40 font-mono uppercase">W-Credits</p>
                <p className="text-xl font-black italic tracking-tighter">14,240.00</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {MARKET_ITEMS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="bg-white/5 border-white/10 overflow-hidden h-full flex flex-col group border-2 border-transparent hover:border-indigo-500/30 transition-all shadow-xl">
                  <div className="aspect-square bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center relative">
                    <item.icon className={`w-16 h-16 ${item.color} opacity-40 group-hover:scale-110 transition-transform`} />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/10 text-[8px] uppercase tracking-widest">{item.type}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight mb-1">{item.name}</h4>
                      <p className="text-[8px] text-white/40 uppercase font-mono tracking-widest">W-ITEM_ID: {item.id}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Coins className="w-3 h-3" />
                        <span className="text-lg font-black italic">{item.price}</span>
                      </div>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6 rounded-xl font-black uppercase text-[10px]">
                        Purchase
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bug Bounty Portal */}
          <Card className="bg-white/5 border-white/10 p-8 rounded-3xl relative overflow-hidden col-span-1 lg:col-span-2">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap className="w-64 h-64 text-indigo-400" />
            </div>
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-black uppercase italic italic">Universal Bug Bounty Portal</h3>
              <p className="text-sm text-white/60 leading-relaxed uppercase">
                Identify manifold vulnerabilities in our <strong>Quantum Causality Engine</strong> or <strong>Neural Link Protocols</strong>. Help secure the core and earn rewards up to 142,000 W-Credits.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-center">
                  <p className="text-[10px] font-black uppercase text-red-400 mb-1">Critical</p>
                  <p className="text-xl font-black italic">50k+</p>
                </div>
                <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-center">
                  <p className="text-[10px] font-black uppercase text-orange-400 mb-1">High</p>
                  <p className="text-xl font-black italic">12k+</p>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-center">
                  <p className="text-[10px] font-black uppercase text-blue-400 mb-1">Low/UI</p>
                  <p className="text-xl font-black italic">500+</p>
                </div>
              </div>
              <Button className="w-full bg-white text-black font-black h-12 rounded-xl mt-4 uppercase text-xs">Submit Vulnerability Manifest</Button>
            </div>
          </Card>

          {/* Used Car & Accessory Marketplace Concepts */}
          <Card className="bg-indigo-600 border-none p-8 rounded-3xl text-white shadow-2xl space-y-6">
            <h3 className="text-xl font-black uppercase italic mb-2">Fleet Resale Manifold</h3>
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black uppercase opacity-60">Verified Pre-Owned</p>
                <h4 className="text-lg font-black italic">Tesla Model π (2025)</h4>
                <p className="text-[8px] uppercase mt-1">Quantum-Ready • 12k Miles</p>
                <Button className="w-full bg-white text-black font-black h-8 rounded-lg mt-4 text-[8px]">View Listing</Button>
              </div>
              <div className="bg-black/20 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black uppercase opacity-60">Health Marketplace</p>
                <h4 className="text-lg font-black italic">Bio-Insurance Pack</h4>
                <p className="text-[8px] uppercase mt-1">Full Vision & Neural Coverage</p>
                <Button className="w-full bg-white text-black font-black h-8 rounded-lg mt-4 text-[8px]">Purchase Plan</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
