import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function CorporateBillingDashboard({ companyEmail }) {
  const { data: billings = [] } = useQuery({
    queryKey: ['corporateBilling', companyEmail],
    queryFn: () => base44.entities.CorporateBilling.filter({ company_email: companyEmail })
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Building2 className="w-4 h-4 text-blue-600" />
          Corporate Billing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {billings.map(bill => (
          <div key={bill.id} className="bg-blue-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-sm">{bill.billing_period}</span>
              <Badge className={bill.invoice_status === 'paid' ? 'bg-green-500' : 'bg-orange-500'}>
                {bill.invoice_status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-600">Rides</p>
                <p className="font-bold">{bill.total_rides}</p>
              </div>
              <div>
                <p className="text-gray-600">Amount</p>
                <p className="font-bold">${bill.total_amount}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full mt-2">
              <Download className="w-3 h-3 mr-1" />
              Download Invoice
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}