import React from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function BuyNowPayLaterOption({ rideRequestId, userEmail, totalAmount }) {
  const bnplMutation = useMutation({
    mutationFn: async () => {
      const installmentAmount = totalAmount / 4;
      const nextPayment = new Date();
      nextPayment.setDate(nextPayment.getDate() + 14);
      
      return await base44.entities.BuyNowPayLater.create({
        user_email: userEmail,
        ride_request_id: rideRequestId,
        total_amount: totalAmount,
        installments: 4,
        installment_amount: installmentAmount,
        paid_installments: 0,
        next_payment_date: nextPayment.toISOString().split('T')[0],
        status: 'active'
      });
    },
    onSuccess: () => {
      toast.success('Pay in 4 installments activated!');
    }
  });

  const installment = (totalAmount / 4).toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <CreditCard className="w-4 h-4 text-indigo-600" />
          Pay in 4 Installments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-gray-600">Split ${totalAmount.toFixed(2)} into 4 interest-free payments</p>
        <div className="bg-indigo-50 rounded p-3">
          <p className="text-xs text-gray-600">Every 2 weeks</p>
          <p className="text-2xl font-bold text-indigo-600">${installment}</p>
        </div>
        <Button onClick={() => bnplMutation.mutate()} variant="outline" className="w-full">
          Use Buy Now, Pay Later
        </Button>
      </CardContent>
    </Card>
  );
}