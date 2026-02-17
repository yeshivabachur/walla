import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';

export default function CancellationFeeDisplay({ userEmail }) {
  const { data: fees = [] } = useQuery({
    queryKey: ['cancellationFees', userEmail],
    queryFn: () => base44.entities.CancellationFee.filter({ cancelled_by: userEmail, waived: false })
  });

  if (fees.length === 0) return null;

  const totalFees = fees.reduce((sum, f) => sum + f.fee_amount, 0);

  return (
    <Card className="border-2 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 text-orange-600" />
          Cancellation Fees
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-700 mb-2">
          {fees.length} cancellation{fees.length > 1 ? 's' : ''} • ${totalFees.toFixed(2)} total
        </p>
        <p className="text-xs text-orange-700">
          Tip: Cancel rides early to avoid fees
        </p>
      </CardContent>
    </Card>
  );
}