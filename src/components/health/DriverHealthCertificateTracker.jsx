import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, AlertCircle } from 'lucide-react';

export default function DriverHealthCertificateTracker({ driverEmail }) {
  const { data: certificates = [] } = useQuery({
    queryKey: ['healthCerts', driverEmail],
    queryFn: () => base44.entities.DriverHealthCertificate.filter({ driver_email: driverEmail })
  });

  const expiring = certificates.filter(c => {
    const daysUntilExpiry = (new Date(c.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry < 30 && daysUntilExpiry > 0;
  });

  if (certificates.length === 0) return null;

  return (
    <Card className="border-2 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Heart className="w-4 h-4 text-red-600" />
          Health Certificates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {expiring.length > 0 && (
          <div className="bg-white rounded p-2 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <p className="text-xs text-orange-800">{expiring.length} expiring soon</p>
          </div>
        )}
        {certificates.map(cert => (
          <div key={cert.id} className="flex justify-between items-center bg-white rounded p-2">
            <span className="text-xs capitalize">{cert.certificate_type.replace('_', ' ')}</span>
            <Badge className={
              cert.status === 'valid' ? 'bg-green-500' :
              cert.status === 'expiring_soon' ? 'bg-orange-500' : 'bg-red-500'
            }>
              {cert.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}