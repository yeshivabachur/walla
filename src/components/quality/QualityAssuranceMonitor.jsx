import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QualityAssuranceMonitor({ driverEmail }) {
  const [qaReport, setQaReport] = useState(null);

  const { data: recentRides = [] } = useQuery({
    queryKey: ['qaRides', driverEmail],
    queryFn: () => base44.entities.RideRequest.filter({
      driver_email: driverEmail,
      status: 'completed'
    }, '-created_date', 10)
  });

  useEffect(() => {
    if (recentRides.length < 5) return;

    const performQA = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Perform quality assurance check for driver.

Recent rides: ${recentRides.length}

Analyze:
1. Overall quality score (0-100)
2. Vehicle cleanliness score
3. Driving quality score
4. Professionalism score
5. Route efficiency score
6. Any issues detected
7. Action required (yes/no)`,
        response_json_schema: {
          type: 'object',
          properties: {
            quality_score: { type: 'number' },
            categories: {
              type: 'object',
              properties: {
                vehicle_cleanliness: { type: 'number' },
                driving_quality: { type: 'number' },
                professionalism: { type: 'number' },
                route_efficiency: { type: 'number' }
              }
            },
            issues_detected: { type: 'array', items: { type: 'string' } },
            action_required: { type: 'boolean' }
          }
        }
      });

      setQaReport(result);

      if (recentRides[0]?.id) {
        await base44.entities.QualityAssurance.create({
          ride_request_id: recentRides[0].id,
          driver_email: driverEmail,
          inspection_date: new Date().toISOString(),
          quality_score: result.quality_score,
          categories: result.categories,
          issues_detected: result.issues_detected,
          action_required: result.action_required
        });
      }
    };

    performQA();
  }, [recentRides, driverEmail]);

  if (!qaReport) return null;

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              Quality Score
            </span>
            <Badge className={qaReport.quality_score >= 90 ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}>
              {qaReport.quality_score}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(qaReport.categories || {}).map(([key, value]) => (
              <div key={key} className="bg-white rounded-lg p-2">
                <p className="text-xs text-gray-600 mb-1 capitalize">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className={`text-lg font-bold ${getScoreColor(value)}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {qaReport.issues_detected?.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <p className="text-xs font-semibold text-yellow-800">Areas for Improvement</p>
              </div>
              {qaReport.issues_detected.map((issue, idx) => (
                <p key={idx} className="text-xs text-yellow-700 mb-1">• {issue}</p>
              ))}
            </div>
          )}

          {!qaReport.action_required && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-xs text-green-800">All standards met</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}