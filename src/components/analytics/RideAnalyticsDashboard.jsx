import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Clock, MapPin } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

export default function RideAnalyticsDashboard({ userEmail }) {
  const { data: rides = [] } = useQuery({
    queryKey: ['rideAnalytics', userEmail],
    queryFn: () => base44.entities.RideRequest.filter({ passenger_email: userEmail, status: 'completed' }),
    enabled: !!userEmail
  });

  if (rides.length < 5) return null;

  const totalSpent = rides.reduce((sum, r) => sum + (r.estimated_price || 0), 0);
  const avgPrice = totalSpent / rides.length;
  
  const monthlyData = rides.reduce((acc, ride) => {
    const month = new Date(ride.created_date).toLocaleDateString('en', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    rides: count
  }));

  const topDestinations = rides.reduce((acc, ride) => {
    acc[ride.dropoff_location] = (acc[ride.dropoff_location] || 0) + 1;
    return acc;
  }, {});

  const destData = Object.entries(topDestinations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 mb-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Ride Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Total Rides</p>
              <p className="text-2xl font-bold text-gray-900">{rides.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${totalSpent}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Avg Price</p>
              <p className="text-2xl font-bold text-gray-900">${avgPrice.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {rides.filter(r => new Date(r.created_date).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
          </div>

          {/* Rides Over Time */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Rides Over Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="rides" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Destinations */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Destinations</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={destData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {destData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}