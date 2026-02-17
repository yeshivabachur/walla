import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WeeklyReportCard({ userEmail, userType }) {
  const [report, setReport] = useState(null);

  const { data: rides = [] } = useQuery({
    queryKey: ['weeklyRides', userEmail],
    queryFn: () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return base44.entities.RideRequest.filter({
        [userType === 'driver' ? 'driver_email' : 'passenger_email']: userEmail,
        status: 'completed',
        created_date: { $gte: weekAgo.toISOString().split('T')[0] }
      });
    }
  });

  useEffect(() => {
    if (rides.length === 0) return;

    const generateReport = async () => {
      const totalAmount = rides.reduce((sum, r) => sum + (r.estimated_price || 0), 0);

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate weekly performance report.

Rides: ${rides.length}
Total: $${totalAmount.toFixed(2)}
User type: ${userType}

Provide:
1. Best performing day
2. Average rating
3. Top 3 achievements
4. 3 actionable insights`,
        response_json_schema: {
          type: 'object',
          properties: {
            best_day: { type: 'string' },
            avg_rating: { type: 'number' },
            achievements: { type: 'array', items: { type: 'string' } },
            insights: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      const reportData = {
        ...result,
        total_rides: rides.length,
        total_amount: totalAmount
      };

      setReport(reportData);

      await base44.entities.WeeklyReport.create({
        user_email: userEmail,
        user_type: userType,
        week_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        metrics: {
          total_rides: rides.length,
          total_amount: totalAmount,
          avg_rating: result.avg_rating,
          best_day: result.best_day
        },
        achievements: result.achievements,
        insights: result.insights
      });
    };

    generateReport();
  }, [rides, userEmail, userType]);

  if (!report) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Week in Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-600">Total Rides</p>
              <p className="text-2xl font-bold text-indigo-600">{report.total_rides}</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-600">Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                ${report.total_amount.toFixed(0)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <p className="text-xs font-semibold text-gray-700">Achievements</p>
            </div>
            {report.achievements?.slice(0, 3).map((achievement, idx) => (
              <Badge key={idx} className="mr-2 mb-2 bg-indigo-100 text-indigo-800">
                {achievement}
              </Badge>
            ))}
          </div>

          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <p className="text-xs font-semibold text-indigo-800">Insights</p>
            </div>
            {report.insights?.slice(0, 2).map((insight, idx) => (
              <p key={idx} className="text-xs text-indigo-700 mb-1">• {insight}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}