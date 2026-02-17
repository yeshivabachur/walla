import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function AutoTipSettings({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: autoTip } = useQuery({
    queryKey: ['autoTip', userEmail],
    queryFn: async () => {
      const tips = await base44.entities.AutoTip.filter({ user_email: userEmail });
      if (tips[0]) return tips[0];
      
      return await base44.entities.AutoTip.create({
        user_email: userEmail,
        enabled: false,
        tip_percentage: 15,
        conditions: { five_star_only: true, min_rating: 4.5 }
      });
    },
    enabled: !!userEmail
  });

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      await base44.entities.AutoTip.update(autoTip.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['autoTip']);
      toast.success('Auto-tip settings updated');
    }
  });

  if (!autoTip) return null;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Auto-Tip
          </span>
          <Switch
            checked={autoTip.enabled}
            onCheckedChange={(checked) => updateMutation.mutate({ enabled: checked })}
          />
        </CardTitle>
      </CardHeader>
      {autoTip.enabled && (
        <CardContent className="space-y-4">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-gray-700 mb-3">Tip Percentage: {autoTip.tip_percentage}%</p>
            <Slider
              value={[autoTip.tip_percentage]}
              onValueChange={([value]) => updateMutation.mutate({ tip_percentage: value })}
              min={10}
              max={25}
              step={5}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span>25%</span>
            </div>
          </div>
          <div className="text-xs text-center text-gray-600">
            Automatically tip drivers with {autoTip.conditions.min_rating}+ rating
          </div>
        </CardContent>
      )}
    </Card>
  );
}