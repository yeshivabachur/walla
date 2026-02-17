import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle, AlertTriangle } from 'lucide-react';

export default function DriverCertificationCard({ driverEmail }) {
  const { data: certifications = [] } = useQuery({
    queryKey: ['driverCerts', driverEmail],
    queryFn: () => base44.entities.DriverCertification.filter({ driver_email: driverEmail })
  });

  if (certifications.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Award className="w-4 h-4 text-purple-600" />
          Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {certifications.map(cert => {
          const isExpired = new Date(cert.expiry_date) < new Date();
          return (
            <div key={cert.id} className="flex items-center justify-between bg-purple-50 rounded p-2">
              <div className="flex items-center gap-2">
                {cert.verified ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                )}
                <span className="text-xs capitalize">{cert.certification_type.replace('_', ' ')}</span>
              </div>
              <Badge className={isExpired ? 'bg-red-500' : 'bg-green-500'}>
                {isExpired ? 'Expired' : 'Valid'}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}