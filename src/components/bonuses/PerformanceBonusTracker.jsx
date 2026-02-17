import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';

export default function PerformanceBonusTracker({ driverEmail }) {
  const { data: bonuses = [] } = useQuery({
    queryKey: ['performanceBonuses', driverEmail],
    queryFn: () => base44.entities.PerformanceBonus.filter({ driver_email: driverEmail })
  });

  const unpaid = bonuses.filter(b => !b.paid);
  const totalUnpaid = unpaid.reduce((sum, b) => sum + b.amount, 0);

  if (bonuses.length === 0) return null;

  return (
    <Card className="border-2 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-yellow-600" />
          Performance Bonuses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white rounded p-3 mb-3">
          <p className="text-xs text-gray-600">Pending Bonuses</p>
          <p className="text-2xl font-bold text-yellow-600">${totalUnpaid}</p>
        </div>
        <div className="space-y-1">
          {unpaid.slice(0, 3).map(bonus => (
            <div key={bonus.id} className="flex justify-between text-xs bg-white rounded p-2">
              <span className="capitalize">{bonus.bonus_type.replace('_', ' ')}</span>
              <span className="font-semibold">${bonus.amount}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}