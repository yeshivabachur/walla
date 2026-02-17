import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';

export default function CustomerLTVTracker({ passengerEmail }) {
  const [ltv, setLtv] = useState(null);

  useEffect(() => {
    const calculateLTV = async () => {
      const rides = await base44.entities.RideRequest.filter({
        passenger_email: passengerEmail,
        status: 'completed'
      });

      const totalSpent = rides.reduce((sum, r) => sum + (r.estimated_price || 0), 0);
      const avgRideValue = rides.length > 0 ? totalSpent / rides.length : 0;
      const predictedLTV = avgRideValue * 50; // Predict 50 future rides

      const data = {
        passenger_email: passengerEmail,
        total_spent: totalSpent,
        total_rides: rides.length,
        average_ride_value: avgRideValue,
        predicted_lifetime_value: predictedLTV,
        churn_risk: rides.length < 5 ? 'high' : rides.length < 20 ? 'medium' : 'low',
        retention_score: Math.min(rides.length * 5, 100),
        last_updated: new Date().toISOString()
      };

      await base44.entities.CustomerLifetimeValue.create(data);
      setLtv(data);
    };

    calculateLTV();
  }, [passengerEmail]);

  if (!ltv) return null;

  return (
    <Card className="border-2 border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          Your Value
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-white rounded p-2">
            <p className="text-xs text-gray-600">Total Spent</p>
            <p className="text-lg font-bold text-purple-600">${ltv.total_spent.toFixed(0)}</p>
          </div>
          <div className="bg-white rounded p-2">
            <p className="text-xs text-gray-600">Predicted LTV</p>
            <p className="text-lg font-bold text-green-600">${ltv.predicted_lifetime_value.toFixed(0)}</p>
          </div>
        </div>
        <Badge className={
          ltv.churn_risk === 'low' ? 'bg-green-500' :
          ltv.churn_risk === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
        }>
          Loyalty: {ltv.retention_score}/100
        </Badge>
      </CardContent>
    </Card>
  );
}