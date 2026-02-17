import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Terminal, Code2, Database, Rocket, 
  FlaskConical, Share2, Play, Bug
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DeveloperSandboxManifold() {
  const [log, setLogs] = useState([
    { time: '04:52:12', msg: 'Quantum_Sync initialized' },
    { time: '04:52:14', msg: 'Reality_Anchor: LOCKED' }
  ]);

  return (
    <Card className="border border-cyan-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-cyan-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Infrastructure Sandbox</span>
          </div>
          <Badge className="bg-cyan-600">ISOLATED_ENV</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-cyan-300 tracking-widest">Manifold Request Console</h4>
          <div className="bg-black border border-white/10 rounded-xl p-4 font-mono text-[10px] space-y-2">
            <p className="text-white/40"># Initiate Multiverse Handshake</p>
            <p className="text-cyan-400">POST /v1/manifold/sync {"{"}</p>
            <p className="pl-4 text-cyan-400">"timeline": "Prime",</p>
            <p className="pl-4 text-cyan-400">"vector": [42.1, 88.2]</p>
            <p className="text-cyan-400">{"}"}</p>
            <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 h-6 text-[8px] font-black uppercase rounded mt-2">
              <Play className="w-3 h-3 mr-1" /> Run Code
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-[10px] font-black uppercase text-white/40">Execution Logs</h4>
          <div className="bg-white/5 rounded-xl border border-white/10 p-3 h-32 overflow-y-auto custom-scrollbar font-mono text-[9px] space-y-1">
            {log.map((l, i) => (
              <p key={i}><span className="text-indigo-400">[{l.time}]</span> <span className="text-white/60">{l.msg}</span></p>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
            <Bug className="w-4 h-4 text-red-400" />
            <div>
              <p className="text-[9px] font-bold uppercase text-white">Debug Mode</p>
              <p className="text-[7px] text-white/40">Verbose Logs On</p>
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
            <Share2 className="w-4 h-4 text-indigo-400" />
            <div>
              <p className="text-[9px] font-bold uppercase text-white">Webhooks</p>
              <p className="text-[7px] text-white/40">4 Active Nodes</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
