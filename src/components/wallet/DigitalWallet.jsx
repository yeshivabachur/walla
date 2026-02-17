import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plus, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function DigitalWallet({ userEmail }) {
  const [addAmount, setAddAmount] = useState('');
  const queryClient = useQueryClient();

  const { data: wallet } = useQuery({
    queryKey: ['wallet', userEmail],
    queryFn: async () => {
      const wallets = await base44.entities.Wallet.filter({ user_email: userEmail });
      return wallets[0];
    },
    enabled: !!userEmail
  });

  const createWalletMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.Wallet.create({
        user_email: userEmail,
        balance: 0,
        transactions: []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wallet']);
    }
  });

  const addFundsMutation = useMutation({
    mutationFn: async (amount) => {
      const newBalance = wallet.balance + amount;
      const newTransaction = {
        type: 'add_funds',
        amount: amount,
        description: 'Added funds',
        timestamp: new Date().toISOString()
      };

      await base44.entities.Wallet.update(wallet.id, {
        balance: newBalance,
        transactions: [...wallet.transactions, newTransaction]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wallet']);
      setAddAmount('');
      toast.success('Funds added successfully!');
    }
  });

  if (!wallet) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <Wallet className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Create Your Wallet</h3>
          <p className="text-sm text-gray-600 mb-4">
            Store money for faster checkout and exclusive offers
          </p>
          <Button
            onClick={() => createWalletMutation.mutate()}
            disabled={createWalletMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
          >
            Create Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-600" />
            Walla Wallet
          </span>
          <Badge className="bg-indigo-600 text-white text-lg px-4 py-1">
            ${wallet.balance.toFixed(2)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-3">Add Funds</p>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              className="rounded-xl"
            />
            <Button
              onClick={() => addFundsMutation.mutate(parseFloat(addAmount))}
              disabled={!addAmount || addFundsMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {wallet.transactions?.length > 0 && (
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-900 mb-3">Recent Transactions</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {wallet.transactions.slice(-5).reverse().map((txn, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    {txn.type === 'add_funds' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-gray-700">{txn.description}</span>
                  </div>
                  <span className={txn.type === 'add_funds' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {txn.type === 'add_funds' ? '+' : '-'}${txn.amount.toFixed(2)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}