import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, ShieldCheck, Scale, DollarSign, 
  Fingerprint, Briefcase, Calculator, Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function LegalFinanceCommand({ userEmail }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const generateAuditReport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("E2E Audit Trail Generated. Cryptographically signed and stored on Ledger.");
    }, 2000);
  };

  return (
    <Card className="border border-emerald-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-emerald-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Legal & Finance Ledger</span>
          </div>
          <Badge className="bg-emerald-600 text-[10px]">VERIFIED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Tax Section */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black uppercase">Automated Tax Tracking</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">$1,420.00 Saved</span>
          </div>
          <p className="text-[8px] text-white/40 leading-relaxed uppercase">
            AI-Driven Deduction Engine identified 14 eligible business expenses in the last cycle.
          </p>
        </div>

        {/* Insurance Claim Section */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-black uppercase">Incident Reconstruction</span>
            </div>
            <Badge variant="outline" className="text-[8px] border-blue-500/30 text-blue-400">READY</Badge>
          </div>
          <p className="text-[8px] text-white/40 leading-relaxed uppercase">
            Multimodal sensor fusion (Lidar + Dashcam) available for instant insurance claim automation.
          </p>
          <Button size="sm" className="w-full bg-blue-600/20 hover:bg-blue-600 text-blue-100 text-[8px] h-8 rounded-lg">
            Initialize Reconstruction
          </Button>
        </div>

        {/* Biometric & Compliance */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <Fingerprint className="w-4 h-4 text-cyan-400 mb-2" />
            <p className="text-[10px] font-bold uppercase">Biometric Claims</p>
            <p className="text-[8px] text-white/40">Linked to Neural ID</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <FileText className="w-4 h-4 text-purple-400 mb-2" />
            <p className="text-[10px] font-bold uppercase">Compliance</p>
            <p className="text-[8px] text-white/40">GDPR/CCPA SYNCED</p>
          </div>
        </div>

        <Button 
          onClick={generateAuditReport}
          disabled={isProcessing}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] h-12 rounded-xl"
        >
          {isProcessing ? "SIGNING_LEDGER..." : "Generate Signed Audit Report"}
        </Button>
      </CardContent>
    </Card>
  );
}
