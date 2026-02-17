import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function WalletBalance({ userEmail }) {
  const [addAmount, setAddAmount] = useState('');
  const queryClient = useQueryClient();

  const { data: wallet } = useQuery({
    queryKey: ['wallet', userEmail],
    queryFn: async () => {
      const wallets = await base44.entities.RideWallet.filter({ user_email: userEmail });
      return wallets[0] || { balance: 0 };
    }
  });

  const addFundsMutation = useMutation({
    mutationFn: async () => {
      const amount = parseFloat(addAmount);
      if (wallet?.id) {
        return await base44.entities.RideWallet.update(wallet.id, {
          balance: wallet.balance + amount,
          transactions: [...(wallet.transactions || []), {
            amount,
            type: 'credit',
            description: 'Funds added',
            date: new Date().toISOString()
          }]
        });
      } else {
        return await base44.entities.RideWallet.create({
          user_email: userEmail,
          balance: amount,
          transactions: [{
            amount,
            type: 'credit',
            description: 'Initial deposit',
            date: new Date().toISOString()
          }]
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wallet']);
      toast.success('Funds added to wallet');
      setAddAmount('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Wallet className="w-4 h-4 text-blue-600" />
          Ride Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-blue-50 rounded p-3">
          <p className="text-xs text-gray-600">Balance</p>
          <p className="text-2xl font-bold text-blue-600">${wallet?.balance?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Amount to add"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
          />
          <Button onClick={() => addFundsMutation.mutate()} disabled={!addAmount}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}