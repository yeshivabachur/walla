import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from 'lucide-react';

export default function ActiveDiscounts({ userEmail }) {
  const { data: discounts = [] } = useQuery({
    queryKey: ['activeDiscounts', userEmail],
    queryFn: () => base44.entities.RideDiscount.filter({ user_email: userEmail, used: false })
  });

  if (discounts.length === 0) return null;

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Tag className="w-4 h-4 text-green-600" />
          Active Discounts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {discounts.map(d => (
          <div key={d.id} className="bg-white rounded-lg p-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold capitalize">{d.discount_type}</span>
              <Badge className="bg-green-600 text-white">{d.discount_percentage}% off</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}