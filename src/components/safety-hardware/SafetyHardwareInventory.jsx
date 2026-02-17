import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  HeartPulse, Shield, Zap, AlertTriangle, 
  CheckCircle2, Hammer, Tool, Info,
  Truck, Radio, LifeBuoy
} from 'lucide-react';
import { motion } from 'framer-motion';

const INVENTORY = [
  { name: 'First Aid Kit v4', qty: '1', status: 'VERIFIED' },
  { name: 'Fire Extinguisher', qty: '1', status: 'INSPECTED' },
  { name: 'Emergency Beacon', qty: '2', status: 'READY' },
  { name: 'Spare Tire (Compact)', qty: '1', status: 'INFLATED' },
  { name: 'Oxygen Reserve', qty: '1', status: 'OPTIMAL' },
  { name: 'Defibrillator (AED)', qty: '1', status: 'CHARGED' }
];

export default function SafetyHardwareInventory() {
  return (
    <Card className="border border-red-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-red-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-red-400">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 animate-pulse" />
            Safety Hardware & Emergency Inventory
          </div>
          <Badge className="bg-red-600">INSPECTED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INVENTORY.map(item => (
            <div key={item.name} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase">{item.name}</p>
                  <p className="text-[7px] text-white/40 font-mono">QUANTITY: {item.qty}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[7px] border-green-500/30 text-green-400 uppercase">{item.status}</Badge>
            </div>
          ))}
        </div>

        {/* Roadside Support */}
        <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-red-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Roadside Assistance Manifold</span>
          </div>
          <p className="text-[8px] text-white/60 leading-relaxed uppercase">
            Direct link active to **AAA**, **Manufacturer Support**, and **Walla Recovery Fleet**.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {['Towing', 'Tire Change', 'Fuel Delivery'].map(s => (
              <div key={s} className="bg-black/40 p-2 rounded-lg border border-white/5 text-center text-[7px] font-black uppercase text-white/40 group-hover:text-red-400 transition-colors cursor-pointer">
                {s}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
