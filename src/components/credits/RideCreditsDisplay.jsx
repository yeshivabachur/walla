import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RideCreditsDisplay({ userEmail }) {
  const { data: credits } = useQuery({
    queryKey: ['rideCredits', userEmail],
    queryFn: async () => {
      const creds = await base44.entities.RideCredits.filter({ user_email: userEmail });
      if (creds[0]) return creds[0];
      
      return await base44.entities.RideCredits.create({
        user_email: userEmail,
        balance: 0,
        transactions: []
      });
    },
    enabled: !!userEmail
  });

  if (!credits || credits.balance === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              Ride Credits
            </span>
            <Badge className="bg-emerald-600 text-white text-lg px-3 py-1">
              ${credits.balance.toFixed(2)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">Recent Transactions</p>
          <div className="space-y-2">
            {credits.transactions.slice(0, 3).map((txn, i) => (
              <div key={i} className="flex items-center justify-between bg-white rounded-lg p-2 text-sm">
                <span className="text-gray-600">{txn.description}</span>
                <span className={`font-semibold ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}