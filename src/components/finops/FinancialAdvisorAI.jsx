import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  PiggyBank, Calculator, TrendingUp, Landmark, 
  FileText, ShieldCheck, Zap, PieChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function FinancialAdvisorAI({ userEmail }) {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  const getFinancialAdvice = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze the ride-hailing earnings profile for user ${userEmail}. 
      Provide specific advice on:
      - 401k contribution optimization
      - Tax deduction strategies for vehicle depreciation
      - Investment opportunities in sustainable fuel index funds
      - Debt payoff planning based on current cash flow`,
      response_json_schema: {
        type: 'object',
        properties: {
          retirement_strategy: { type: 'string' },
          tax_savings_est: { type: 'string' },
          investment_tip: { type: 'string' },
          audit_probability: { type: 'number' }
        }
      }
    });
    setAdvice(result);
    setLoading(false);
  };

  return (
    <Card className="border border-green-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col">
      <CardHeader className="border-b border-white/5 bg-green-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-4 h-4 text-green-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Wealth & Retirement AI</span>
          </div>
          <Badge className="bg-green-600">LEDGER_SYNC_ON</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {!advice ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <PieChart className="w-12 h-12 text-white/10" />
            <p className="text-xs text-white/40 uppercase font-mono">Profile Analysis Required</p>
            <Button 
              onClick={getFinancialAdvice}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 h-10 px-6 rounded-xl font-bold uppercase text-[10px]"
            >
              {loading ? "Interrogating Ledger..." : "Analyze Portfolio"}
            </Button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-green-300 italic">Retirement Manifold</span>
                <Badge variant="outline" className="text-[8px] border-green-500/30 text-green-400">OPTIMIZED</Badge>
              </div>
              <p className="text-[10px] leading-relaxed text-gray-300">{advice.retirement_strategy}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-[8px] text-white/40 uppercase font-mono mb-1">Est. Tax Alpha</p>
                <p className="text-sm font-black text-green-400">{advice.tax_savings_est}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-[8px] text-white/40 uppercase font-mono mb-1">Investment Rec</p>
                <p className="text-[10px] font-bold text-cyan-400 truncate">{advice.investment_tip}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[8px] font-mono text-white/20 uppercase">Audit_Probability: {advice.audit_probability}%</span>
              <ShieldCheck className="w-4 h-4 text-green-400" />
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
