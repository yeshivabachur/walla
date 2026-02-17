import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';

export default function DailySummaryCard({ driverEmail }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const generateSummary = async () => {
      const today = new Date().toISOString().split('T')[0];
      const rides = await base44.entities.RideRequest.filter({
        driver_email: driverEmail,
        status: 'completed',
        created_date: { $gte: today }
      });

      const totalEarnings = rides.reduce((sum, r) => sum + (r.estimated_price || 0), 0);

      const summaryData = {
        driver_email: driverEmail,
        date: today,
        total_rides: rides.length,
        total_earnings: totalEarnings,
        highlights: [
          `Completed ${rides.length} rides`,
          `Earned $${totalEarnings.toFixed(2)}`,
          'Great job today!'
        ]
      };

      await base44.entities.DailySummary.create(summaryData);
      setSummary(summaryData);
    };

    generateSummary();
  }, [driverEmail]);

  if (!summary) return null;

  return (
    <Card className="border-2 border-indigo-200 bg-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          Today's Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white rounded p-2">
            <p className="text-xs text-gray-600">Rides</p>
            <p className="text-xl font-bold text-indigo-600">{summary.total_rides}</p>
          </div>
          <div className="bg-white rounded p-2">
            <p className="text-xs text-gray-600">Earnings</p>
            <p className="text-xl font-bold text-green-600">${summary.total_earnings.toFixed(0)}</p>
          </div>
        </div>
        <div className="space-y-1">
          {summary.highlights?.map((h, i) => (
            <p key={i} className="text-xs text-indigo-700">• {h}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}