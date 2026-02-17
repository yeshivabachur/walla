import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrainingAnalytics({ driverEmail }) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const analyzeTraining = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze driver training progress.

Driver: ${driverEmail}

Provide:
1. Overall completion percentage
2. Performance score (0-100)
3. Earned certifications (list 2)
4. Improvement areas (list 2)`,
        response_json_schema: {
          type: 'object',
          properties: {
            completion_percentage: { type: 'number' },
            performance_score: { type: 'number' },
            certifications: { type: 'array', items: { type: 'string' } },
            improvement_areas: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setProgress(result);

      await base44.entities.TrainingProgress.create({
        driver_email: driverEmail,
        module: 'comprehensive_training',
        completion_percentage: result.completion_percentage,
        last_activity: new Date().toISOString(),
        performance_score: result.performance_score,
        certifications: result.certifications,
        improvement_areas: result.improvement_areas
      });
    };

    analyzeTraining();
  }, [driverEmail]);

  if (!progress) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            Training Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Completion</span>
              <span className="text-lg font-bold text-indigo-600">
                {progress.completion_percentage}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress.completion_percentage}%` }}
              />
            </div>
          </div>

          {progress.certifications?.length > 0 && (
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-2">Certifications</p>
              {progress.certifications.map((cert, idx) => (
                <Badge key={idx} className="mr-2 mb-1 bg-indigo-600 text-white">
                  {cert}
                </Badge>
              ))}
            </div>
          )}

          {progress.improvement_areas?.length > 0 && (
            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-3 h-3 text-indigo-600" />
                <p className="text-xs font-semibold text-indigo-800">Focus Areas</p>
              </div>
              {progress.improvement_areas.map((area, idx) => (
                <p key={idx} className="text-xs text-indigo-700 mb-1">• {area}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}