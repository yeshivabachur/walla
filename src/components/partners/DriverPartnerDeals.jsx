import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from 'lucide-react';

export default function DriverPartnerDeals() {
  const { data: partners = [] } = useQuery({
    queryKey: ['partnerDeals'],
    queryFn: () => base44.entities.DriverPartner.filter({ active: true })
  });

  if (partners.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Tag className="w-4 h-4 text-purple-600" />
          Partner Deals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {partners.slice(0, 3).map(p => (
          <div key={p.id} className="bg-purple-50 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{p.partner_name}</span>
              <Badge className="bg-purple-600">{p.discount_percentage}% off</Badge>
            </div>
            <p className="text-xs text-gray-600 mt-1">{p.location}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}