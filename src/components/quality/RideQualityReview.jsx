import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Star, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function RideQualityReview({ rideRequestId, onComplete }) {
  const [scores, setScores] = useState({
    comfort: 5,
    cleanliness: 5,
    professionalism: 5,
    efficiency: 5,
    punctuality: 5
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const overall = Object.values(scores).reduce((a, b) => a + b, 0) / 5;
      
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this ride quality feedback:
- Comfort: ${scores.comfort}/5
- Cleanliness: ${scores.cleanliness}/5
- Professionalism: ${scores.professionalism}/5
- Efficiency: ${scores.efficiency}/5
- Punctuality: ${scores.punctuality}/5

Provide brief analysis and improvement suggestions.`,
        response_json_schema: {
          type: 'object',
          properties: {
            analysis: { type: 'string' },
            suggestions: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      return await base44.entities.RideQualityScore.create({
        ride_request_id: rideRequestId,
        overall_score: overall,
        comfort_score: scores.comfort,
        cleanliness_score: scores.cleanliness,
        driver_professionalism: scores.professionalism,
        route_efficiency: scores.efficiency,
        punctuality_score: scores.punctuality,
        ai_analysis: analysis.analysis,
        improvement_suggestions: analysis.suggestions
      });
    },
    onSuccess: () => {
      toast.success('Quality review submitted!');
      onComplete?.();
    }
  });

  return (
    <Card className="border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Rate Your Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries({
          comfort: 'Comfort',
          cleanliness: 'Cleanliness',
          professionalism: 'Driver Professionalism',
          efficiency: 'Route Efficiency',
          punctuality: 'Punctuality'
        }).map(([key, label]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">{label}</span>
              <span className="text-sm text-indigo-600">{scores[key]}/5</span>
            </div>
            <Slider
              value={[scores[key]]}
              onValueChange={([value]) => setScores({ ...scores, [key]: value })}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
          </div>
        ))}

        <Button
          onClick={() => submitMutation.mutate()}
          disabled={submitMutation.isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          Submit Review
        </Button>
      </CardContent>
    </Card>
  );
}