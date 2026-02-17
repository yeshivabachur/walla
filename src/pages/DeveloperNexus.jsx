import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, Code2, Database, Rocket, 
  Map, FlaskConical, Github, Share2,
  Lock, Key, Bug, Layers
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const API_ENDPOINTS = [
  { method: 'POST', path: '/v1/ride/displace', desc: 'Initiate quantum displacement' },
  { method: 'GET', path: '/v1/user/dna-profile', desc: 'Retrieve genetic personalization manifold' },
  { method: 'PUT', path: '/v1/vehicle/cloak', desc: 'Adjust stealth signature' }
];

export default function DeveloperNexusHub() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 relative">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-8 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic flex items-center gap-4 text-cyan-400">
              <Terminal className="w-10 h-10" />
              Developer Nexus
            </h1>
            <p className="text-white/40 font-mono text-sm mt-2 uppercase italic">Interfacing with the Walla Core Infrastructure</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-white/10 text-white h-12 px-6 rounded-xl font-bold uppercase text-xs">API Documentation</Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white h-12 px-6 rounded-xl font-black uppercase text-xs">Sandbox Environment</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Public Roadmap */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white/5 border-white/10 p-8 rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Rocket className="w-64 h-64 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-8">Public Evolution Roadmap</h3>
              <div className="space-y-8">
                {[
                  { phase: 'Phase 4', title: 'Wormhole Expansion', status: 'In-Progress', desc: 'Deploying sub-space transit gates in 12 major metropolitan sectors.' },
                  { phase: 'Phase 5', title: 'Neural-Ride v2', status: 'Beta', desc: 'Expanding BCI bandwidth for direct-thought vehicle steering.' },
                  { phase: 'Phase 6', title: 'Causality Engine', status: 'Alpha', desc: 'Predictive ride fulfillment based on future temporal echoes.' }
                ].map((p, i) => (
                  <div key={p.phase} className="flex gap-6 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center font-black text-xs z-10 shadow-[0_0_20px_rgba(6,182,212,0.4)]">{i+4}</div>
                      {i < 2 && <div className="w-0.5 h-20 bg-cyan-950 absolute top-10" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-black uppercase tracking-tighter italic">{p.title}</h4>
                        <Badge className="bg-white/10 text-cyan-400 text-[8px] uppercase">{p.status}</Badge>
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed max-w-lg">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card className="bg-white/5 border-white/10 p-6 rounded-3xl space-y-4">
                 <div className="flex items-center gap-3 text-cyan-400">
                   <Key className="w-5 h-5" />
                   <h4 className="text-sm font-black uppercase tracking-widest">API Key Vault</h4>
                 </div>
                 <div className="bg-black p-3 rounded-lg border border-white/5 font-mono text-[10px] text-cyan-400/60 truncate">
                   sk_live_42f88...neural_992
                 </div>
                 <Button variant="ghost" className="w-full text-white/40 hover:text-white text-[8px] uppercase font-bold">Rotate Master Secret</Button>
               </Card>
               <Card className="bg-white/5 border-white/10 p-6 rounded-3xl space-y-4">
                 <div className="flex items-center gap-3 text-purple-400">
                   <Bug className="w-5 h-5" />
                   <h4 className="text-sm font-black uppercase tracking-widest">Bug Bounty Portal</h4>
                 </div>
                 <p className="text-[10px] text-white/40 uppercase leading-relaxed">Secure the core. Rewards up to <strong>142,000 W-Credits</strong> for critical manifold vulnerabilities.</p>
                 <Button className="w-full bg-purple-600/20 hover:bg-purple-600 text-purple-100 text-[10px] h-10 rounded-xl font-black">Report Leak</Button>
               </Card>
            </div>
          </div>

          {/* API Sandbox Section */}
          <div className="space-y-8">
            <Card className="bg-cyan-600 border-none p-8 rounded-3xl text-white shadow-[0_0_50px_rgba(6,182,212,0.3)]">
              <h3 className="text-xl font-black uppercase italic mb-6">Live Manifold Explorer</h3>
              <div className="space-y-4">
                {API_ENDPOINTS.map(ep => (
                  <div key={ep.path} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black bg-black/40 px-1.5 py-0.5 rounded text-cyan-200">{ep.method}</span>
                      <span className="text-[10px] font-mono font-bold">{ep.path}</span>
                    </div>
                    <p className="text-[8px] opacity-60 uppercase tracking-tighter">{ep.desc}</p>
                  </div>
                ))}
                <div className="pt-4">
                  <div className="bg-black/40 rounded-xl p-4 font-mono text-[10px] space-y-1">
                    <p className="text-green-400">{"{"}</p>
                    <p className="pl-4">"status": "synchronized",</p>
                    <p className="pl-4">"latency": 0.00042,</p>
                    <p className="pl-4 text-cyan-400">"reality_index": 1.0</p>
                    <p className="text-green-400">{"}"}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6 rounded-3xl space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">Integrations SDK</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-white/10 text-white h-10 rounded-xl text-[10px] font-bold uppercase gap-2">
                  <Github className="w-3 h-3" />
                  Swift
                </Button>
                <Button variant="outline" className="border-white/10 text-white h-10 rounded-xl text-[10px] font-bold uppercase gap-2">
                  <Code2 className="w-3 h-3" />
                  Python
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
