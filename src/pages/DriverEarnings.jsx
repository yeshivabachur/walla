import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Calendar, Clock, Loader2, ArrowUpRight, TrendingDown, Zap, Target, Gift, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, startOfWeek, startOfMonth, endOfWeek, endOfMonth } from 'date-fns';
import EarningsChart from '@/components/earnings/EarningsChart';
import PayoutPreferences from '@/components/earnings/PayoutPreferences';

export default function DriverEarnings() {
  const [user, setUser] = useState(null);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {}
    };
    loadUser();
  }, []);

  const { data: earnings = [], isLoading } = useQuery({
    queryKey: ['driverEarnings', user?.email],
    queryFn: () => base44.entities.DriverEarnings.filter({ driver_email: user.email }, '-created_date'),
    enabled: !!user,
    refetchInterval: 5000 // Real-time updates every 5 seconds
  });

  const { data: profile } = useQuery({
    queryKey: ['driverProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.DriverProfile.filter({ driver_email: user.email });
      return profiles[0];
    },
    enabled: !!user
  });

  const { data: payoutHistory = [] } = useQuery({
    queryKey: ['payoutHistory', user?.email],
    queryFn: () => base44.entities.PayoutHistory.filter({ driver_email: user.email }, '-created_date'),
    enabled: !!user
  });

  // Calculate earnings by period
  const getEarningsByPeriod = (periodType) => {
    const now = new Date();
    let start, end;

    if (periodType === 'day') {
      start = new Date(now.setHours(0, 0, 0, 0));
      end = new Date(now.setHours(23, 59, 59, 999));
    } else if (periodType === 'week') {
      start = startOfWeek(now);
      end = endOfWeek(now);
    } else {
      start = startOfMonth(now);
      end = endOfMonth(now);
    }

    return earnings.filter(e => {
      const date = new Date(e.created_date);
      return date >= start && date <= end;
    }).reduce((sum, e) => sum + e.driver_earning, 0);
  };

  const totalEarnings = earnings.reduce((sum, e) => sum + e.driver_earning, 0);
  const pendingEarnings = earnings
    .filter(e => e.payout_status === 'pending')
    .reduce((sum, e) => sum + e.driver_earning, 0);
  const totalRides = earnings.length;
  const todayEarnings = getEarningsByPeriod('day');
  const weekEarnings = getEarningsByPeriod('week');
  const monthEarnings = getEarningsByPeriod('month');

  // Calculate detailed breakdowns
  const totalSurgeBonus = earnings.reduce((sum, e) => {
    if (e.surge_multiplier > 1) {
      const baseEarning = (e.base_fare / e.surge_multiplier) * 0.8;
      return sum + (e.driver_earning - baseEarning);
    }
    return sum;
  }, 0);

  // Earnings breakdown by type (simulated - would use actual ride type in production)
  const earningsByType = {
    standard: earnings.filter(e => e.surge_multiplier === 1).reduce((sum, e) => sum + e.driver_earning, 0),
    surge: earnings.filter(e => e.surge_multiplier > 1).reduce((sum, e) => sum + e.driver_earning, 0),
    tips: 0 // Placeholder for future tips feature
  };

  // Get AI insights for increasing earnings
  const { data: aiInsights } = useQuery({
    queryKey: ['earningsInsights', user?.email, earnings.length],
    queryFn: async () => {
      if (earnings.length === 0) return null;
      
      const weeklyEarnings = getEarningsByPeriod('week');
      const monthlyEarnings = getEarningsByPeriod('month');
      const avgPerRide = totalEarnings / earnings.length;
      const surgeRidePercentage = (earnings.filter(e => e.surge_multiplier > 1).length / earnings.length * 100).toFixed(0);
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze driver earnings data and provide actionable insights to increase income:

Earnings Data:
- Total Rides: ${earnings.length}
- Total Earnings: $${totalEarnings.toFixed(2)}
- This Week: $${weeklyEarnings.toFixed(2)}
- This Month: $${monthlyEarnings.toFixed(2)}
- Average per Ride: $${avgPerRide.toFixed(2)}
- Surge Rides: ${surgeRidePercentage}% of total
- Total Surge Bonus: $${totalSurgeBonus.toFixed(2)}

Provide:
1. Top 3 earning opportunities based on data patterns
2. Best times to drive for maximum earnings
3. Strategies to capture more surge rides
4. Tips to increase average ride value
5. Weekly earning goal with action plan`,
        response_json_schema: {
          type: 'object',
          properties: {
            opportunities: { 
              type: 'array', 
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  potential_increase: { type: 'string' }
                }
              }
            },
            best_times: { type: 'array', items: { type: 'string' } },
            surge_strategies: { type: 'array', items: { type: 'string' } },
            ride_value_tips: { type: 'array', items: { type: 'string' } },
            weekly_goal: {
              type: 'object',
              properties: {
                amount: { type: 'string' },
                action_plan: { type: 'string' }
              }
            }
          }
        }
      });
      return result;
    },
    enabled: !!user && earnings.length > 0
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Earnings</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-1">+${todayEarnings.toFixed(2)} today</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-2xl font-bold text-gray-900">${weekEarnings.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">{earnings.filter(e => {
                  const date = new Date(e.created_date);
                  return date >= startOfWeek(new Date());
                }).length} rides</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">Pending Payout</p>
                <p className="text-2xl font-bold text-gray-900">${pendingEarnings.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Next: {profile?.payout_preference || 'weekly'}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">Surge Bonus</p>
                <p className="text-2xl font-bold text-gray-900">${totalSurgeBonus.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">From {totalRides} rides</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Earnings Breakdown */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              Earnings Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <Badge className="bg-blue-600 text-white">Standard</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">Regular Rides</p>
                <p className="text-2xl font-bold text-gray-900">${earningsByType.standard.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {earnings.filter(e => e.surge_multiplier === 1).length} rides
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <Badge className="bg-orange-600 text-white">Surge</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">Surge Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${totalSurgeBonus.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {earnings.filter(e => e.surge_multiplier > 1).length} surge rides
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <Badge className="bg-green-600 text-white">Tips</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">Tips & Bonuses</p>
                <p className="text-2xl font-bold text-gray-900">${earningsByType.tips.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Coming soon</p>
              </div>
            </div>

            {/* Breakdown by Day/Week/Month */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Today</p>
                <p className="text-xl font-bold text-gray-900">${todayEarnings.toFixed(2)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">This Week</p>
                <p className="text-xl font-bold text-gray-900">${weekEarnings.toFixed(2)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">This Month</p>
                <p className="text-xl font-bold text-gray-900">${monthEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Earnings Insights */}
        {aiInsights && (
          <Card className="border-0 shadow-lg mb-8 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                AI Earnings Optimizer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Earning Opportunities */}
              {aiInsights.opportunities?.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-3">💰 Top Earning Opportunities</p>
                  <div className="space-y-3">
                    {aiInsights.opportunities.map((opp, i) => (
                      <div key={i} className="bg-white rounded-lg p-4 border border-indigo-100">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-gray-900">{opp.title}</p>
                          <Badge className="bg-green-100 text-green-800">{opp.potential_increase}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{opp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Best Times to Drive */}
              {aiInsights.best_times?.length > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                  <p className="text-sm font-bold text-blue-900 mb-2">⏰ Best Times to Drive</p>
                  <ul className="space-y-1">
                    {aiInsights.best_times.map((time, i) => (
                      <li key={i} className="text-sm text-blue-800 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {time}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Surge Strategies */}
              {aiInsights.surge_strategies?.length > 0 && (
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg">
                  <p className="text-sm font-bold text-orange-900 mb-2">⚡ Surge Ride Strategies</p>
                  <ul className="space-y-1">
                    {aiInsights.surge_strategies.map((strategy, i) => (
                      <li key={i} className="text-sm text-orange-800 flex items-start gap-2">
                        <Zap className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ride Value Tips */}
              {aiInsights.ride_value_tips?.length > 0 && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                  <p className="text-sm font-bold text-green-900 mb-2">📈 Increase Ride Value</p>
                  <ul className="space-y-1">
                    {aiInsights.ride_value_tips.map((tip, i) => (
                      <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                        <TrendingUp className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weekly Goal */}
              {aiInsights.weekly_goal && (
                <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-lg">
                  <p className="text-sm font-bold text-purple-900 mb-2">🎯 Your Weekly Goal</p>
                  <p className="text-2xl font-bold text-purple-700 mb-2">{aiInsights.weekly_goal.amount}</p>
                  <p className="text-sm text-purple-800">{aiInsights.weekly_goal.action_plan}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Charts and Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Tabs value={period} onValueChange={setPeriod}>
              <div className="flex items-center justify-between mb-4">
                <TabsList className="bg-white border">
                  <TabsTrigger value="day">Daily</TabsTrigger>
                  <TabsTrigger value="week">Weekly</TabsTrigger>
                  <TabsTrigger value="month">Monthly</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value={period} className="mt-0">
                <EarningsChart earnings={earnings} period={period} />
              </TabsContent>
            </Tabs>
          </div>
          <PayoutPreferences profile={profile} />
        </div>

        {/* Payout History */}
        {payoutHistory.length > 0 && (
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payoutHistory.map((payout, index) => (
                  <motion.div
                    key={payout.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">${payout.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        {payout.processed_date ? format(new Date(payout.processed_date), 'MMM d, yyyy') : 'Processing'}
                      </p>
                      <p className="text-xs text-gray-400">****{payout.bank_account_last_4}</p>
                    </div>
                    <Badge className={
                      payout.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : payout.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }>
                      {payout.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bank Details */}
        {profile?.bank_account_number && (
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Bank Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Account Holder</p>
                    <p className="font-semibold">{profile.bank_account_holder}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Bank Name</p>
                    <p className="font-semibold">{profile.bank_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Account Number</p>
                    <p className="font-semibold">****{profile.bank_account_number.slice(-4)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Next Payout</p>
                    <p className="font-semibold text-indigo-600">Weekly (Every Monday)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Earnings History */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Earnings History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {earnings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No earnings yet. Complete rides to start earning!
                </div>
              ) : (
                earnings.map((earning, index) => (
                  <motion.div
                    key={earning.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-50 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-gray-900">
                          Ride #{earning.ride_request_id.slice(0, 8)}
                        </p>
                        <Badge className={
                          earning.payout_status === 'paid' 
                            ? 'bg-green-100 text-green-800'
                            : earning.payout_status === 'processed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }>
                          {earning.payout_status}
                        </Badge>
                        {earning.surge_multiplier > 1 && (
                          <Badge className="bg-orange-100 text-orange-800">
                            {earning.surge_multiplier}x Surge
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(earning.created_date), 'MMM d, yyyy')}
                        </span>
                        <span>Base: ${earning.base_fare.toFixed(2)}</span>
                        <span>Total: ${earning.total_fare.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        +${earning.driver_earning.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        (${earning.commission.toFixed(2)} fee)
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}