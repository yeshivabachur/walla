import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from 'lucide-react';

export default function TipHistoryCard({ driverEmail }) {
  const { data: tips = [] } = useQuery({
    queryKey: ['tipHistory', driverEmail],
    queryFn: () => base44.entities.TipHistory.filter({ recipient_email: driverEmail })
  });

  const totalTips = tips.reduce((sum, tip) => sum + tip.amount, 0);

  if (tips.length === 0) return null;

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-green-600" />
          Tips Received
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-green-700">${totalTips}</p>
        <p className="text-xs text-gray-600">{tips.length} tips total</p>
      </CardContent>
    </Card>
  );
}