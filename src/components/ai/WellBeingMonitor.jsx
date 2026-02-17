import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Coffee, AlertTriangle, CheckCircle, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function WellBeingMonitor({ driverEmail }) {
  const [showBreakSuggestion, setShowBreakSuggestion] = useState(false);
  const queryClient = useQueryClient();

  const { data: wellbeing } = useQuery({
    queryKey: ['driverWellbeing', driverEmail],
    queryFn: async () => {
      const data = await base44.entities.DriverWellbeing.filter({ driver_email: driverEmail });
      return data[0];
    },
    enabled: !!driverEmail
  });

  const updateWellbeingMutation = useMutation({
    mutationFn: async (updates) => {
      if (wellbeing) {
        await base44.entities.DriverWellbeing.update(wellbeing.id, updates);
      } else {
        await base44.entities.DriverWellbeing.create({
          driver_email: driverEmail,
          ...updates
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['driverWellbeing']);
    }
  });

  useEffect(() => {
    if (!wellbeing) return;

    // Monitor fatigue and suggest breaks
    if (wellbeing.hours_driven_today >= 4 && wellbeing.well_being_status !== 'excellent') {
      setShowBreakSuggestion(true);
    }

    // Auto-calculate fatigue based on hours driven
    const newFatigue = Math.min((wellbeing.hours_driven_today / 8) * 100, 100);
    if (Math.abs(newFatigue - wellbeing.fatigue_score) > 10) {
      updateWellbeingMutation.mutate({ fatigue_score: newFatigue });
    }
  }, [wellbeing]);

  const takeBreak = () => {
    updateWellbeingMutation.mutate({
      last_break_time: new Date().toISOString(),
      hours_driven_today: 0,
      fatigue_score: 0,
      well_being_status: 'excellent'
    });
    setShowBreakSuggestion(false);
    toast.success('Break logged! Stay refreshed 🌟');
  };

  if (!wellbeing) return null;

  const statusConfig = {
    excellent: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Excellent' },
    good: { color: 'bg-blue-100 text-blue-800', icon: Heart, label: 'Good' },
    fair: { color: 'bg-yellow-100 text-yellow-800', icon: Coffee, label: 'Fair' },
    needs_attention: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, label: 'Needs Attention' }
  };

  const status = statusConfig[wellbeing.well_being_status] || statusConfig.good;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            Well-being Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Status</span>
            <Badge className={status.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>

          {/* Fatigue Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Fatigue Level</span>
              <span className="text-sm font-semibold">{Math.round(wellbeing.fatigue_score)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  wellbeing.fatigue_score < 30 ? 'bg-green-500' :
                  wellbeing.fatigue_score < 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${wellbeing.fatigue_score}%` }}
              />
            </div>
          </div>

          {/* Hours Driven */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Hours Driven Today</span>
            <span className="font-semibold">{wellbeing.hours_driven_today.toFixed(1)}h</span>
          </div>

          {/* Break Suggestion */}
          {showBreakSuggestion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <Coffee className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-orange-900 mb-1">
                    Time for a break!
                  </p>
                  <p className="text-xs text-orange-800 mb-3">
                    You've been driving for {wellbeing.hours_driven_today.toFixed(1)} hours. A short break will help you stay alert and safe.
                  </p>
                  <Button
                    size="sm"
                    onClick={takeBreak}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    I'm Taking a Break
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Recommendations */}
          {wellbeing.ai_recommendations?.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-900 mb-2">💡 AI Recommendations</p>
              <ul className="space-y-1">
                {wellbeing.ai_recommendations.map((rec, i) => (
                  <li key={i} className="text-xs text-blue-800">• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}