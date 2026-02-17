import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DriverBehaviorAnalytics({ driverEmail }) {
  const [analytics, setAnalytics] = useState(null);

  const { data: completedRides = [] } = useQuery({
    queryKey: ['driverCompletedRides', driverEmail],
    queryFn: () => base44.entities.RideRequest.filter({
      driver_email: driverEmail,
      status: 'completed'
    })
  });

  useEffect(() => {
    if (completedRides.length < 5) return;

    const analyzeEehavior = async () => {
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyze driver behavior and performance.

Total completed rides: ${completedRides.length}
Driver email: ${driverEmail}

Evaluate:
1. Safe driving score (0-100)
2. Customer service score (0-100)
3. Punctuality score (0-100)
4. Vehicle condition score (0-100)
5. Overall score (average)
6. Top 2 improvement areas
7. Strengths`,
          response_json_schema: {
            type: 'object',
            properties: {
              safe_driving_score: { type: 'number' },
              customer_service_score: { type: 'number' },
              punctuality_score: { type: 'number' },
              vehicle_condition_score: { type: 'number' },
              overall_score: { type: 'number' },
              improvement_areas: { type: 'array', items: { type: 'string' } },
              strengths: { type: 'string' }
            }
          }
        });

        setAnalytics(result);

        await base44.entities.DriverBehaviorScore.create({
          driver_email: driverEmail,
          overall_score: result.overall_score,
          safe_driving_score: result.safe_driving_score,
          customer_service_score: result.customer_service_score,
          punctuality_score: result.punctuality_score,
          vehicle_condition_score: result.vehicle_condition_score,
          improvement_areas: result.improvement_areas
        });
      } catch (error) {
        console.error('Behavior analysis failed:', error);
      }
    };

    analyzeBehavior();
  }, [completedRides, driverEmail]);

  if (!analytics) return null;

  const scoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Performance Score
            </span>
            <Badge className={analytics.overall_score >= 90 ? 'bg-green-600' : 'bg-yellow-600'}>
              {analytics.overall_score}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Safe Driving</p>
              <p className={`text-lg font-bold ${scoreColor(analytics.safe_driving_score)}`}>
                {analytics.safe_driving_score}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Customer Service</p>
              <p className={`text-lg font-bold ${scoreColor(analytics.customer_service_score)}`}>
                {analytics.customer_service_score}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Punctuality</p>
              <p className={`text-lg font-bold ${scoreColor(analytics.punctuality_score)}`}>
                {analytics.punctuality_score}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Vehicle Care</p>
              <p className={`text-lg font-bold ${scoreColor(analytics.vehicle_condition_score)}`}>
                {analytics.vehicle_condition_score}
              </p>
            </div>
          </div>

          {analytics.strengths && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-green-800">Strengths</span>
              </div>
              <p className="text-xs text-green-700">{analytics.strengths}</p>
            </div>
          )}

          {analytics.improvement_areas?.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-semibold text-yellow-800">
                  Areas to Improve
                </span>
              </div>
              <ul className="space-y-1">
                {analytics.improvement_areas.map((area, idx) => (
                  <li key={idx} className="text-xs text-yellow-700">
                    • {area}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}