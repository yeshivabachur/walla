import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from 'lucide-react';

export default function VehicleInsuranceCard({ vehicleId }) {
  const { data: insurance } = useQuery({
    queryKey: ['vehicleInsurance', vehicleId],
    queryFn: async () => {
      const data = await base44.entities.VehicleInsurance.filter({ vehicle_id: vehicleId });
      return data[0];
    }
  });

  if (!insurance) return null;

  const daysUntilExpiry = Math.ceil(
    (new Date(insurance.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className={`border-2 ${daysUntilExpiry < 30 ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-blue-600" />
          Insurance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">{insurance.provider}</span>
          <Badge className={insurance.is_valid ? 'bg-green-600' : 'bg-red-600'}>
            {insurance.is_valid ? 'Valid' : 'Expired'}
          </Badge>
        </div>
        <p className="text-xs text-gray-600">
          Expires in {daysUntilExpiry} days
        </p>
      </CardContent>
    </Card>
  );
}