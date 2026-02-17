import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, TrendingUp, Heart, Share2, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MicroEconomyManifold({ userEmail }) {
  return (
    <Card className="border border-green-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl overflow-hidden h-full flex flex-col">
      <CardHeader className="border-b border-white/5 bg-green-500/5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="uppercase tracking-[0.2em] font-black italic text-sm">Micro-Economy Hub</span>
          </div>
          <Badge className="bg-green-600">LIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Investment Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase text-green-300">Ride-Share Investment</h4>
            <Badge variant="outline" className="text-[8px] border-green-500/30 text-green-400">+12.4% APY</Badge>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/40 uppercase font-mono">Portfolio Balance</p>
              <p className="text-xl font-black italic tracking-tighter">$4,240.92</p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        {/* Charity Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-blue-300">Charitable Round-Ups</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
              <Heart className="w-4 h-4 text-blue-400 mb-2" />
              <p className="text-[10px] font-bold text-white uppercase">Active Fund</p>
              <p className="text-[8px] text-white/60">Ocean Cleanup AI</p>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
              <Share2 className="w-4 h-4 text-purple-400 mb-2" />
              <p className="text-[10px] font-bold text-white uppercase">Impact</p>
              <p className="text-[8px] text-white/60">42 trees planted</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white font-black uppercase text-[10px] h-12 rounded-xl">
            Auto-Invest Ride Savings
          </Button>
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-black uppercase text-[10px] h-12 rounded-xl">
            Configure Donations
          </Button>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[8px] text-white/40 uppercase font-mono">
          <ShieldCheck className="w-3 h-3 text-green-400" />
          Secured by Zero-Knowledge Proofs (ZKP)
        </div>
      </CardContent>
    </Card>
  );
}
