import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar } from 'lucide-react';

export default function QuarterlyTaxCalculator({ driverEmail }) {
  const { data: estimate } = useQuery({
    queryKey: ['taxEstimate', driverEmail],
    queryFn: async () => {
      const quarter = Math.ceil((new Date().getMonth() + 1) / 3);
      const year = new Date().getFullYear();
      
      const estimates = await base44.entities.QuarterlyTaxEstimate.filter({
        driver_email: driverEmail,
        quarter,
        year
      });
      return estimates[0];
    }
  });

  if (!estimate) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-purple-600" />
          Q{estimate.quarter} Tax Estimate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="bg-purple-50 rounded p-2">
          <p className="text-xs text-gray-600">Estimated Tax Owed</p>
          <p className="text-2xl font-bold text-purple-600">${estimate.estimated_tax_owed?.toFixed(2)}</p>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Self-employment tax</span>
            <span>${estimate.self_employment_tax?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Federal income tax</span>
            <span>${estimate.federal_income_tax?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>State income tax</span>
            <span>${estimate.state_income_tax?.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Calendar className="w-3 h-3" />
          Due: {estimate.payment_due_date}
        </div>
      </CardContent>
    </Card>
  );
}