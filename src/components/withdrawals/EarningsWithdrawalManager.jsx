import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

export default function EarningsWithdrawalManager({ driverEmail, availableBalance }) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');

  const { data: withdrawals = [] } = useQuery({
    queryKey: ['withdrawals', driverEmail],
    queryFn: () => base44.entities.EarningsWithdrawal.filter({ driver_email: driverEmail })
  });

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.EarningsWithdrawal.create({
        driver_email: driverEmail,
        amount: parseFloat(amount),
        withdrawal_method: method,
        status: 'pending',
        requested_date: new Date().toISOString(),
        fee: method === 'instant_pay' ? parseFloat(amount) * 0.01 : 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['withdrawals']);
      toast.success('Withdrawal requested');
      setAmount('');
    }
  });

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-green-600" />
          Withdraw Earnings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-white rounded-lg p-3 mb-3">
          <p className="text-xs text-gray-600">Available Balance</p>
          <p className="text-2xl font-bold text-green-700">${availableBalance || 0}</p>
        </div>
        
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          max={availableBalance}
        />
        
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bank_transfer">Bank Transfer (Free, 2-3 days)</SelectItem>
            <SelectItem value="instant_pay">Instant Pay (1% fee)</SelectItem>
            <SelectItem value="paypal">PayPal (Free, 1 day)</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={() => withdrawMutation.mutate()} 
          disabled={!amount || parseFloat(amount) > availableBalance}
          className="w-full bg-green-600"
          size="sm"
        >
          Request Withdrawal
        </Button>

        {withdrawals.length > 0 && (
          <div className="space-y-1 mt-4">
            <p className="text-xs font-semibold">Recent Withdrawals</p>
            {withdrawals.slice(0, 3).map(w => (
              <div key={w.id} className="flex justify-between bg-white rounded p-2 text-xs">
                <span>${w.amount}</span>
                <Badge className={
                  w.status === 'completed' ? 'bg-green-500' :
                  w.status === 'processing' ? 'bg-blue-500' :
                  w.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                }>
                  {w.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}