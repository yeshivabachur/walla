import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, Award, Target, Clock, Star, Zap, 
  Trophy, Loader2, CheckCircle, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function DriverAnalytics() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {}
    };
    loadUser();
  }, []);

  const { data: performance, isLoading } = useQuery({
    queryKey: ['myPerformance', user?.email],
    queryFn: async () => {
      const perf = await base44.entities.DriverPerformance.filter({ driver_email: user.email });
      return perf[0] || null;
    },
    enabled: !!user
  });

  const { data: allPerformance = [] } = useQuery({
    queryKey: ['allPerformance'],
    queryFn: () => base44.entities.DriverPerformance.list()
  });

  const { data: earnings = [] } = useQuery({
    queryKey: ['myEarnings', user?.email],
    queryFn: () => base44.entities.DriverEarnings.filter({ driver_email: user.email }, '-created_date'),
    enabled: !!user
  });

  // Get AI-driven insights
  const { data: aiInsights } = useQuery({
    queryKey: ['aiInsights', user?.email, performance?.id],
    queryFn: async () => {
      if (!performance) return null;
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze driver performance and provide actionable insights:

Performance Metrics:
- Total Rides: ${performance.total_rides}
- Completion Rate: ${((performance.completed_rides / Math.max(performance.total_rides, 1)) * 100).toFixed(1)}%
- Average Rating: ${performance.average_rating}/5
- On-Time: ${performance.on_time_percentage}%
- Acceptance Rate: ${performance.acceptance_rate}%
- Efficiency Score: ${performance.efficiency_score}/100
- Customer Service: ${performance.customer_service_score}/100
- Current Streak: ${performance.current_streak} days

Provide:
1. Top 3 strengths
2. Top 3 areas for improvement with specific actionable advice
3. Personalized tips to increase earnings
4. Recommended focus areas for next week`,
        response_json_schema: {
          type: 'object',
          properties: {
            strengths: { type: 'array', items: { type: 'string' } },
            improvements: { 
              type: 'array', 
              items: { 
                type: 'object',
                properties: {
                  area: { type: 'string' },
                  advice: { type: 'string' }
                }
              }
            },
            earning_tips: { type: 'array', items: { type: 'string' } },
            weekly_focus: { type: 'string' }
          }
        }
      });
      return result;
    },
    enabled: !!performance && !!user
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!performance) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Performance Analytics</h1>
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No performance data yet. Complete rides to see your analytics.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate ranking
  const sortedDrivers = [...allPerformance].sort((a, b) => b.total_earnings - a.total_earnings);
  const rank = sortedDrivers.findIndex(d => d.driver_email === user.email) + 1;

  // Performance radar chart data
  const radarData = [
    { metric: 'Acceptance Rate', value: performance.acceptance_rate },
    { metric: 'On-Time %', value: performance.on_time_percentage },
    { metric: 'Rating', value: (performance.average_rating / 5) * 100 },
    { metric: 'Efficiency', value: performance.efficiency_score },
    { metric: 'Service', value: performance.customer_service_score }
  ];

  // Badge definitions
  const availableBadges = [
    { id: 'rookie', name: '🚀 Rookie', description: 'Complete 10 rides', earned: performance.completed_rides >= 10 },
    { id: 'pro', name: '⭐ Pro Driver', description: 'Complete 50 rides', earned: performance.completed_rides >= 50 },
    { id: 'legend', name: '🏆 Legend', description: 'Complete 200 rides', earned: performance.completed_rides >= 200 },
    { id: '5star', name: '🌟 5-Star', description: 'Maintain 5.0 rating for 20 rides', earned: performance.average_rating >= 4.9 && performance.completed_rides >= 20 },
    { id: 'efficient', name: '⚡ Efficiency Master', description: '95%+ efficiency score', earned: performance.efficiency_score >= 95 },
    { id: 'streak', name: '🔥 Streak Champion', description: '7-day streak', earned: performance.current_streak >= 7 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-lg">
            <Trophy className="w-5 h-5 mr-2" />
            Rank #{rank}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {((performance.completed_rides / Math.max(performance.total_rides, 1)) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{performance.average_rating.toFixed(2)}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">On-Time Performance</p>
                <p className="text-2xl font-bold text-gray-900">{performance.on_time_percentage}%</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{performance.current_streak} days</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced AI Insights */}
        <Card className="border-0 shadow-lg mb-8 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              AI-Powered Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights ? (
              <>
                {/* Strengths */}
                {aiInsights.strengths?.length > 0 && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                    <p className="text-sm font-bold text-green-800 mb-2">💪 Your Strengths</p>
                    <ul className="space-y-1">
                      {aiInsights.strengths.map((strength, i) => (
                        <li key={i} className="text-xs text-green-700 flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {aiInsights.improvements?.length > 0 && (
                  <div className="space-y-2">
                    {aiInsights.improvements.map((improvement, i) => (
                      <div key={i} className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-blue-800">📈 {improvement.area}</p>
                        <p className="text-xs text-blue-700 mt-1">{improvement.advice}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Earning Tips */}
                {aiInsights.earning_tips?.length > 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <p className="text-sm font-bold text-yellow-800 mb-2">💰 Maximize Your Earnings</p>
                    <ul className="space-y-1">
                      {aiInsights.earning_tips.map((tip, i) => (
                        <li key={i} className="text-xs text-yellow-700 flex items-start gap-2">
                          <DollarSign className="w-3 h-3 mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weekly Focus */}
                {aiInsights.weekly_focus && (
                  <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-lg">
                    <p className="text-sm font-bold text-purple-800 mb-2">🎯 This Week's Focus</p>
                    <p className="text-xs text-purple-700">{aiInsights.weekly_focus}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Generating personalized insights...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="performance" className="mb-8">
          <TabsList className="bg-white border">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Performance Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Your Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Ride Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Total Rides</span>
                        <span className="font-semibold">{performance.total_rides}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: '100%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Completed</span>
                        <span className="font-semibold text-green-600">{performance.completed_rides}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600" 
                          style={{ width: `${(performance.completed_rides / Math.max(performance.total_rides, 1)) * 100}%` }} 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Cancelled</span>
                        <span className="font-semibold text-red-600">{performance.cancelled_rides}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-600" 
                          style={{ width: `${(performance.cancelled_rides / Math.max(performance.total_rides, 1)) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableBadges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-xl border-2 ${
                        badge.earned
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400'
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-3">{badge.name.split(' ')[0]}</div>
                        <p className="font-semibold text-gray-900">{badge.name.substring(2)}</p>
                        <p className="text-xs text-gray-600 mt-2">{badge.description}</p>
                        {badge.earned && (
                          <Badge className="mt-3 bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Earned
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-indigo-600" />
                  Top Drivers This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedDrivers.slice(0, 10).map((driver, index) => {
                    const isCurrentUser = driver.driver_email === user?.email;
                    return (
                      <motion.div
                        key={driver.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-4 rounded-xl ${
                          isCurrentUser ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-400 text-yellow-900' :
                            index === 1 ? 'bg-gray-300 text-gray-700' :
                            index === 2 ? 'bg-orange-400 text-orange-900' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {isCurrentUser ? 'You' : `Driver ${driver.driver_email.substring(0, 8)}`}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{driver.completed_rides} rides</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                {driver.average_rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${driver.total_earnings.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Earned</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}