import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function WorkingHoursOptimizer({ driverEmail, currentProfile }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const { data: performance } = useQuery({
    queryKey: ['driverPerformance', driverEmail],
    queryFn: async () => {
      const perf = await base44.entities.DriverPerformance.filter({ driver_email: driverEmail });
      return perf[0];
    },
    enabled: !!driverEmail
  });

  const { data: earnings = [] } = useQuery({
    queryKey: ['driverEarnings', driverEmail],
    queryFn: () => base44.entities.DriverEarnings.filter({ driver_email: driverEmail }),
    enabled: !!driverEmail
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (aiSuggestions) => {
      await base44.entities.DriverProfile.update(currentProfile.id, {
        ai_suggested_hours: aiSuggestions
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['driverProfile']);
      toast.success('AI suggestions updated!');
    }
  });

  const generateSuggestions = async () => {
    setIsGenerating(true);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze driver performance and earnings to suggest optimal working hours:

Performance Data:
- Total Rides: ${performance?.total_rides || 0}
- Completed Rides: ${performance?.completed_rides || 0}
- Average Rating: ${performance?.average_rating || 5}/5
- Efficiency Score: ${performance?.efficiency_score || 100}/100
- Total Earnings: $${earnings.reduce((sum, e) => sum + e.driver_earning, 0).toFixed(2)}

Current Working Hours: ${currentProfile.preferred_working_hours ? 
  `${currentProfile.preferred_working_hours.start_time} - ${currentProfile.preferred_working_hours.end_time}` : 
  'Not set'}

Based on demand patterns and performance metrics, suggest:
1. Optimal peak hours to maximize earnings
2. Reasoning for the suggestions
3. Potential earnings increase percentage`,
        response_json_schema: {
          type: 'object',
          properties: {
            peak_hours: {
              type: 'array',
              items: { type: 'string' }
            },
            reasoning: { type: 'string' },
            potential_earnings_increase: { type: 'string' }
          }
        }
      });

      updateProfileMutation.mutate(result);
    } catch (error) {
      toast.error('Failed to generate suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestedHours = currentProfile?.ai_suggested_hours;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          AI Working Hours Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!suggestedHours ? (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">
              Get AI-powered recommendations for optimal working hours based on demand patterns
            </p>
            <Button
              onClick={generateSuggestions}
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Suggestions
                </>
              )}
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-lg p-4 border border-indigo-200">
              <p className="text-sm font-semibold text-indigo-900 mb-2">📊 Recommended Peak Hours</p>
              <div className="flex flex-wrap gap-2">
                {suggestedHours.peak_hours?.map((hour, i) => (
                  <Badge key={i} className="bg-indigo-100 text-indigo-800">
                    <Clock className="w-3 h-3 mr-1" />
                    {hour}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <p className="text-sm font-semibold text-green-900 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Potential Earnings Increase
              </p>
              <p className="text-2xl font-bold text-green-600">
                {suggestedHours.potential_earnings_increase}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-2">💡 Analysis</p>
              <p className="text-sm text-gray-700">{suggestedHours.reasoning}</p>
            </div>

            <Button
              variant="outline"
              onClick={generateSuggestions}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                'Refresh Suggestions'
              )}
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}