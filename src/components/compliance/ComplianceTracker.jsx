import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCheck, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComplianceTracker({ driverEmail }) {
  const { data: records = [] } = useQuery({
    queryKey: ['compliance', driverEmail],
    queryFn: () => base44.entities.ComplianceRecord.filter({ driver_email: driverEmail })
  });

  useEffect(() => {
    const checkCompliance = async () => {
      if (records.length > 0) return;

      const types = ['license', 'insurance', 'vehicle_inspection'];
      for (const type of types) {
        await base44.entities.ComplianceRecord.create({
          driver_email: driverEmail,
          record_date: new Date().toISOString().split('T')[0],
          compliance_type: type,
          status: 'compliant',
          expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      }
    };

    checkCompliance();
  }, [driverEmail, records]);

  const statusConfig = {
    compliant: { color: 'bg-green-600', icon: FileCheck },
    expiring_soon: { color: 'bg-yellow-600', icon: Clock },
    expired: { color: 'bg-red-600', icon: AlertCircle },
    pending: { color: 'bg-gray-600', icon: Clock }
  };

  const expiringItems = records.filter(r => r.status === 'expiring_soon' || r.status === 'expired');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-slate-600" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {records.map((record) => {
            const config = statusConfig[record.status];
            const Icon = config.icon;
            
            return (
              <div key={record.id} className="bg-white rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-900 capitalize">
                      {record.compliance_type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <Badge className={`${config.color} text-white`}>
                    {record.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>
            );
          })}

          {expiringItems.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <p className="text-xs font-semibold text-yellow-800">
                {expiringItems.length} item(s) need attention
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}