import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function EarningsChart({ earnings, period }) {
  // Group earnings by date
  const groupedData = earnings.reduce((acc, earning) => {
    const date = new Date(earning.created_date);
    let key;
    
    if (period === 'day') {
      key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (period === 'week') {
      const weekNum = Math.ceil(date.getDate() / 7);
      key = `Week ${weekNum}`;
    } else {
      key = date.toLocaleDateString('en-US', { month: 'short' });
    }
    
    if (!acc[key]) {
      acc[key] = { date: key, base: 0, surge: 0, total: 0 };
    }
    
    const baseFare = earning.base_fare * 0.8; // Driver's 80%
    const surgeFare = (earning.driver_earning - baseFare);
    
    acc[key].base += baseFare;
    acc[key].surge += surgeFare;
    acc[key].total += earning.driver_earning;
    
    return acc;
  }, {});
  
  const chartData = Object.values(groupedData).slice(-10);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Earnings Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value) => `$${value.toFixed(2)}`}
              contentStyle={{ borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="base" fill="#6366f1" name="Base Fare" stackId="a" />
            <Bar dataKey="surge" fill="#f59e0b" name="Surge Bonus" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}