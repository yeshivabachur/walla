import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Clock, XCircle, FileText, Shield, Car } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerificationStatus({ profile }) {
  const checks = [
    {
      title: 'Driver License',
      status: profile?.license_verification_status || 'pending',
      icon: FileText,
      notes: profile?.license_verification_notes
    },
    {
      title: 'Background Check',
      status: profile?.background_check_status || 'pending',
      icon: Shield,
      date: profile?.background_check_date
    },
    {
      title: 'Vehicle Registration',
      status: profile?.vehicle_verification_status || 'pending',
      icon: Car
    },
    {
      title: 'Insurance',
      status: profile?.insurance_verification_status || 'pending',
      icon: FileText
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'verified':
      case 'cleared':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Verified' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' };
      case 'in_progress':
        return { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'In Progress' };
      default:
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' };
    }
  };

  const allVerified = checks.every(c => 
    c.status === 'verified' || c.status === 'cleared'
  );

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Verification Status</CardTitle>
          {allVerified && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!allVerified && (
          <Alert className="border-blue-200 bg-blue-50">
            <Clock className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              Our AI system is reviewing your documents. Most verifications complete within 2-4 hours.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {checks.map((check, index) => {
            const Icon = check.icon;
            const statusConfig = getStatusConfig(check.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={check.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{check.title}</p>
                    {check.notes && (
                      <p className="text-xs text-gray-500 mt-1">{check.notes}</p>
                    )}
                    {check.date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Checked: {new Date(check.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <Badge className={statusConfig.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}