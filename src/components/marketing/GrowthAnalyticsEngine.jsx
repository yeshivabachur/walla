import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Rocket, Share2, BarChart3, TrendingUp, 
  Target, Zap, PieChart, Users
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function GrowthAnalyticsEngine() {
  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-indigo-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Growth & Viral Engine</span>
          </div>
          <Badge className="bg-indigo-600">v4.0_READY</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="grid grid-cols-2 gap-4">
          {/* Referral Velocity */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono text-cyan-400">K-FACTOR: 1.42</span>
            </div>
            <p className="text-[10px] font-black uppercase">Viral Velocity</p>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: ['40%', '90%', '60%'] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="h-full bg-cyan-500" 
              />
            </div>
          </div>

          {/* Multi-touch Attribution */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-mono text-purple-400">ROAS: 12.4x</span>
            </div>
            <p className="text-[10px] font-black uppercase">Attribution</p>
            <div className="flex gap-0.5 items-end h-4">
              {[4,7,3,9,5].map((h, i) => (
                <div key={i} className="flex-1 bg-purple-500/40" style={{ height: `${h*10}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Multivariate Testing */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-indigo-300">Multi-variate Experiments</h4>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-3">
            <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest">
              <span>Exp_ID: B44-OMEGA</span>
              <span className="text-green-400">WINNING: VARIANT_B</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-indigo-500/20 text-center border border-indigo-500/20">
                <span className="text-[8px] block opacity-60 uppercase">Variant A</span>
                <span className="text-[10px] font-bold">12.4% Conv</span>
              </div>
              <div className="p-2 rounded bg-green-500/20 text-center border border-green-500/20">
                <span className="text-[8px] block opacity-60 uppercase">Variant B</span>
                <span className="text-[10px] font-bold text-green-400">18.2% Conv</span>
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] h-12 rounded-xl">
          Launch New Growth Sprints
        </Button>

        <div className="flex items-center justify-between text-[8px] font-mono text-white/20 mt-2 uppercase">
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3" />
            <span>CLV Prediction: +$420/user</span>
          </div>
          <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
