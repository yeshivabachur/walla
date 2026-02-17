import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function AutoTipToggle({ userEmail }) {
  const [enabled, setEnabled] = useState(false);
  const [percentage, setPercentage] = useState(15);

  const { data: settings } = useQuery({
    queryKey: ['autoTip', userEmail],
    queryFn: async () => {
      const result = await base44.entities.AutoTipSettings.filter({ user_email: userEmail });
      if (result[0]) {
        setEnabled(result[0].enabled);
        setPercentage(result[0].tip_percentage);
      }
      return result[0];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (settings?.id) {
        return await base44.entities.AutoTipSettings.update(settings.id, {
          enabled,
          tip_percentage: percentage,
          minimum_rating_required: 4.0,
          max_tip_amount: 50
        });
      }
      return await base44.entities.AutoTipSettings.create({
        user_email: userEmail,
        enabled,
        tip_percentage: percentage,
        minimum_rating_required: 4.0,
        max_tip_amount: 50
      });
    },
    onSuccess: () => {
      toast.success('Auto-tip settings saved');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-green-600" />
          Auto-Tip
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Enable auto-tip</span>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
        {enabled && (
          <>
            <div>
              <label className="text-sm text-gray-600">Tip percentage</label>
              <Input
                type="number"
                min="5"
                max="30"
                value={percentage}
                onChange={(e) => setPercentage(parseInt(e.target.value))}
              />
            </div>
            <p className="text-xs text-gray-600">Auto-tip for rides rated 4+ stars</p>
          </>
        )}
        <Button onClick={() => saveMutation.mutate()} className="w-full" size="sm">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}