import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, DollarSign, Clock, ArrowRight, 
  Wallet, ShieldCheck, Activity, BarChart3,
  Calendar, CheckCircle2, AlertTriangle, Landmark,
  CreditCard, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function DriverPayouts() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: payouts = [], isLoading: loadingPayouts } = useQuery({
    queryKey: ['payouts', user?.email],
    queryFn: () => base44.entities.PayoutHistory.filter({ driver_email: user?.email }),
    enabled: !!user?.email
  });

  const cashOutMutation = useMutation({
    mutationFn: async () => {
      // Simulate instant cash out logic
      return new Promise((resolve) => setTimeout(resolve, 2000));
    },
    onSuccess: () => {
      toast.success('Neural Cash-Out Successful! Funds dispatched to your digital vault.');
    }
  });

  const totalEarnings = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingBalance = 1420.42; // Simulated live balance

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.1),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-8 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic flex items-center gap-4 text-indigo-400">
              <Wallet className="w-12 h-12" />
              Payout Command
            </h1>
            <p className="text-white/40 font-mono text-sm mt-2 uppercase">Manage your earnings and neural-bank transfers</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-xl">
              <Activity className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-[10px] text-white/40 font-mono uppercase">Sync Status</p>
                <p className="text-sm font-black italic tracking-tighter uppercase">REAL_TIME_VALIDATED</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Card */}
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-none p-8 rounded-3xl text-white shadow-[0_0_50px_rgba(79,70,229,0.3)] flex flex-col justify-between h-[400px]">
            <div className="space-y-2">
              <Badge className="bg-white/20 text-white uppercase tracking-widest text-[10px]">Pending Balance</Badge>
              <h2 className="text-6xl font-black italic tracking-tighter">${pendingBalance}</h2>
              <p className="text-white/60 text-xs font-mono uppercase">Neural_ID: {user?.email?.split('@')[0] || 'GUEST'}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/60 text-[10px] uppercase font-bold">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Verified Banking: <span className="text-white">Walla-Ledger-7G</span>
              </div>
              <Button 
                onClick={() => cashOutMutation.mutate()}
                disabled={cashOutMutation.isPending}
                className="w-full bg-white text-indigo-600 hover:bg-white/90 h-16 rounded-2xl font-black uppercase tracking-widest text-lg shadow-2xl"
              >
                {cashOutMutation.isPending ? 'Cashing Out...' : 'Neural Cash-Out'}
              </Button>
              <p className="text-[8px] text-center opacity-40 uppercase">Instant transfer enabled via Blockchain Mesh</p>
            </div>
          </Card>

          {/* Transaction History */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white/5 border-white/10 p-8 rounded-3xl h-full flex flex-col overflow-hidden">
              <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-black uppercase italic italic">Transaction Ledger</CardTitle>
                <Button variant="ghost" className="text-[10px] font-black uppercase text-indigo-400">View All</Button>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar space-y-4">
                {payouts.length === 0 && !loadingPayouts ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                    <Landmark className="w-16 h-16" />
                    <p className="text-xs font-black uppercase">No Payout History Detected</p>
                  </div>
                ) : (
                  payouts.map((p, i) => (
                    <motion.div 
                      key={p.id || i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-tight">Payout #{(p.id || '').substring(0,8)}</p>
                          <p className="text-[8px] text-white/40 font-mono uppercase">{p.payout_date ? format(new Date(p.payout_date), 'PPP') : 'PENDING'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black italic tracking-tighter text-emerald-400">+${p.amount}</p>
                        <Badge variant="outline" className="text-[7px] border-emerald-500/30 text-emerald-400 uppercase">COMPLETED</Badge>
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/5 border-white/10 p-6 rounded-3xl space-y-4">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <div>
              <p className="text-[10px] text-white/40 uppercase font-mono">Quarterly Growth</p>
              <p className="text-2xl font-black italic">+142%</p>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-cyan-400" />
            </div>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6 rounded-3xl space-y-4">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-[10px] text-white/40 uppercase font-mono">Total Life Earnings</p>
              <p className="text-2xl font-black italic">${totalEarnings.toLocaleString()}</p>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-purple-400" />
            </div>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6 rounded-3xl space-y-4">
            <Zap className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-[10px] text-white/40 uppercase font-mono">Bonus Multiplier</p>
              <p className="text-2xl font-black italic">1.4x</p>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} className="h-full bg-yellow-400" />
            </div>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6 rounded-3xl space-y-4 border-2 border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.1)]">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <div>
              <p className="text-[10px] text-white/40 uppercase font-mono">Tax Compliance</p>
              <p className="text-2xl font-black italic text-indigo-400">READY</p>
            </div>
            <p className="text-[8px] text-white/40 uppercase font-mono">Estimated quarterly tax set aside: $4,200</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
