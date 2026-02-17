import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, TrendingUp, Target, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AICoachingAssistant({ driverEmail }) {
  const [coaching, setCoaching] = useState(null);

  const { data: recentRides = [] } = useQuery({
    queryKey: ['recentDriverRides', driverEmail],
    queryFn: () => base44.entities.RideRequest.filter({
      driver_email: driverEmail,
      status: 'completed'
    }, '-created_date', 10)
  });

  useEffect(() => {
    if (recentRides.length < 5) return;

    const generateCoaching = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Provide AI coaching for ride-share driver based on recent performance.

Recent rides: ${recentRides.length}
Driver: ${driverEmail}

Analyze and provide:
1. Main coaching focus area (safety/customer_service/efficiency/navigation)
2. 3 specific topics to improve
3. 3 actionable recommendations
4. 2 action items for this week
5. Progress score (0-100)`,
        response_json_schema: {
          type: 'object',
          properties: {
            coaching_type: { type: 'string' },
            topics: { type: 'array', items: { type: 'string' } },
            recommendations: { type: 'array', items: { type: 'string' } },
            action_items: { type: 'array', items: { type: 'string' } },
            progress_score: { type: 'number' }
          }
        }
      });

      setCoaching(result);

      await base44.entities.DriverCoaching.create({
        driver_email: driverEmail,
        session_date: new Date().toISOString().split('T')[0],
        coaching_type: result.coaching_type,
        topics: result.topics,
        recommendations: result.recommendations,
        action_items: result.action_items,
        progress_score: result.progress_score
      });
    };

    generateCoaching();
  }, [recentRides, driverEmail]);

  if (!coaching) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              AI Coaching
            </span>
            <Badge className={coaching.progress_score > 75 ? 'bg-green-600' : 'bg-purple-600'}>
              {coaching.progress_score}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Focus Area</p>
            <p className="text-sm font-semibold text-gray-900 capitalize">
              {coaching.coaching_type.replace(/_/g, ' ')}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <p className="text-xs font-semibold text-gray-700">Key Topics</p>
            </div>
            {coaching.topics?.map((topic, idx) => (
              <div key={idx} className="bg-white rounded-lg p-2 text-xs text-gray-700">
                • {topic}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <p className="text-xs font-semibold text-gray-700">Recommendations</p>
            </div>
            {coaching.recommendations?.map((rec, idx) => (
              <div key={idx} className="bg-purple-50 rounded-lg p-2 text-xs text-purple-800 border border-purple-200">
                {rec}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              <p className="text-xs font-semibold text-gray-700">This Week's Actions</p>
            </div>
            {coaching.action_items?.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-2 text-xs text-gray-700">
                ✓ {item}
              </div>
            ))}
          </div>

          <Button
            onClick={() => toast.success('Coaching session saved!')}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            Mark as Reviewed
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}