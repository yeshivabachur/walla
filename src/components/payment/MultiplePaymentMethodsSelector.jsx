import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function MultiplePaymentMethodsSelector({ rideRequestId, totalAmount }) {
  const [splits, setSplits] = useState([
    { payment_method: 'credit_card', amount: totalAmount, percentage: 100 }
  ]);

  const addSplit = () => {
    setSplits([...splits, { payment_method: 'debit_card', amount: 0, percentage: 0 }]);
  };

  const updateSplit = (index, field, value) => {
    const newSplits = [...splits];
    newSplits[index][field] = value;
    setSplits(newSplits);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.MultiplePaymentMethods.create({
        ride_request_id: rideRequestId,
        payment_splits: splits,
        primary_method: splits[0].payment_method,
        total_amount: totalAmount
      });
    },
    onSuccess: () => {
      toast.success('Payment methods configured');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <CreditCard className="w-4 h-4 text-blue-600" />
          Multiple Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {splits.map((split, idx) => (
          <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded">
            <Select value={split.payment_method} onValueChange={(v) => updateSplit(idx, 'payment_method', v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Credit</SelectItem>
                <SelectItem value="debit_card">Debit</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="points">Points</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Amount"
              value={split.amount}
              onChange={(e) => updateSplit(idx, 'amount', parseFloat(e.target.value))}
              className="w-24"
            />
            {splits.length > 1 && (
              <Button onClick={() => setSplits(splits.filter((_, i) => i !== idx))} size="sm" variant="ghost">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button onClick={addSplit} variant="outline" size="sm" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
        <Button onClick={() => saveMutation.mutate()} className="w-full">
          Save Payment Split
        </Button>
      </CardContent>
    </Card>
  );
}