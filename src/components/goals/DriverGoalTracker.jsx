import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from 'lucide-react';

export default function DriverGoalTracker({ driverEmail }) {
  const { data: goals = [] } = useQuery({
    queryKey: ['driverGoals', driverEmail],
    queryFn: () => base44.entities.DriverGoal.filter({ driver_email: driverEmail, completed: false })
  });

  if (goals.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Target className="w-4 h-4 text-indigo-600" />
          Active Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {goals.slice(0, 3).map(goal => {
          const progress = (goal.current_value / goal.target_value) * 100;
          return (
            <div key={goal.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{goal.goal_type}</span>
                <span className="font-semibold">{goal.current_value}/{goal.target_value}</span>
              </div>
              <Progress value={progress} className="h-2" />
              {goal.reward && (
                <p className="text-xs text-gray-600 mt-1">🎁 {goal.reward}</p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}