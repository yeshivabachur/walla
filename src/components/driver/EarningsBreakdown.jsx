import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

export default function EarningsBreakdown({ driverEmail }) {
  const { data: earnings } = useQuery({
    queryKey: ['afterExpense', driverEmail],
    queryFn: async () => {
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
      
      const result = await base44.entities.AfterExpenseEarnings.filter({
        driver_email: driverEmail,
        period_start: weekStart
      });
      return result[0];
    }
  });

  if (!earnings) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-green-600" />
          Weekly Earnings Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Gross Earnings</span>
          <span className="font-bold text-green-600">${earnings.gross_earnings?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Fuel</span>
          <span className="text-red-600">-${earnings.fuel_costs?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Maintenance</span>
          <span className="text-red-600">-${earnings.maintenance_costs?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Insurance</span>
          <span className="text-red-600">-${earnings.insurance_costs?.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between">
          <span className="font-bold">Net Earnings</span>
          <span className="font-bold text-green-600 text-lg">${earnings.net_earnings?.toFixed(2)}</span>
        </div>
        <div className="bg-blue-50 rounded p-2">
          <p className="text-xs text-gray-600">Profit Margin</p>
          <p className="text-lg font-bold text-blue-600">{earnings.profit_margin?.toFixed(1)}%</p>
        </div>
      </CardContent>
    </Card>
  );
}