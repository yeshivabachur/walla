import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from 'lucide-react';

export default function DriverNetworkHub({ driverEmail }) {
  const { data: network } = useQuery({
    queryKey: ['driverNetwork', driverEmail],
    queryFn: async () => {
      const networks = await base44.entities.DriverNetwork.filter({ driver_email: driverEmail });
      return networks[0];
    }
  });

  if (!network || network.connected_driver_emails?.length === 0) return null;

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-blue-600" />
          Driver Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white rounded p-3 mb-2">
          <p className="text-2xl font-bold text-blue-600">{network.connected_driver_emails?.length || 0}</p>
          <p className="text-xs text-gray-600">Connected Drivers</p>
        </div>
        {network.network_benefits?.length > 0 && (
          <div className="space-y-1">
            {network.network_benefits.slice(0, 2).map((benefit, idx) => (
              <p key={idx} className="text-xs text-blue-700">• {benefit}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}