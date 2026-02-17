import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, Eye, Trash2, Download, 
  FileText, Lock, Activity, Binary
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function PrivacyGovernanceManifold() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      toast.success("Right to be Forgotten Initiated. Scrambling Neural ID...");
    }, 3000);
  };

  return (
    <Card className="border border-green-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl overflow-hidden h-full flex flex-col">
      <CardHeader className="border-b border-white/5 bg-green-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Privacy & Sovereignty</span>
          </div>
          <Badge className="bg-green-600">GDPR_CCPA_ALIGNED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase text-green-300">Algorithmic Transparency</h4>
            <span className="text-[10px] font-mono text-white/40">v.AI-4.2</span>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-black uppercase">Decision Audit Log</span>
            </div>
            <p className="text-[8px] text-white/40 leading-relaxed uppercase">
              View the mathematical factors that determined your last 5 ride prices and routes.
            </p>
            <Button size="sm" className="w-full bg-cyan-600/20 hover:bg-cyan-600 text-cyan-100 text-[8px] h-8 rounded-lg">
              Download Audit Trail
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center text-center gap-2">
            <Download className="w-5 h-5 text-indigo-400" />
            <p className="text-[10px] font-bold uppercase">Data Portability</p>
            <p className="text-[7px] text-white/40">EXPORT_FULL_JSON</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center text-center gap-2">
            <Lock className="w-5 h-5 text-purple-400" />
            <p className="text-[10px] font-bold uppercase">Encryption Keys</p>
            <p className="text-[7px] text-white/40">ROTATE_AES_GCM</p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <Button 
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full h-12 rounded-xl font-black uppercase tracking-tighter text-[10px] bg-red-950/40 hover:bg-red-600 border border-red-500/30"
          >
            {isDeleting ? "WIPING_NODES..." : "Execute Right to be Forgotten"}
          </Button>
        </div>

        <div className="flex items-center justify-between text-[8px] font-mono text-white/20 mt-2 uppercase">
          <span>Storage: Zero-Knowledge</span>
          <div className="flex items-center gap-1">
            <Binary className="w-3 h-3" />
            <span>Audit_Hash: 0x82f...a42</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
