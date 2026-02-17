import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function SurgeProtectionSettings({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: protection } = useQuery({
    queryKey: ['surgeProtection', userEmail],
    queryFn: async () => {
      const prots = await base44.entities.SurgeProtection.filter({ user_email: userEmail });
      if (prots[0]) return prots[0];
      
      return await base44.entities.SurgeProtection.create({
        user_email: userEmail,
        enabled: false,
        max_multiplier: 1.5
      });
    },
    enabled: !!userEmail
  });

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      await base44.entities.SurgeProtection.update(protection.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['surgeProtection']);
      toast.success('Surge protection updated');
    }
  });

  if (!protection) return null;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Surge Protection
          </span>
          <Switch
            checked={protection.enabled}
            onCheckedChange={(checked) => updateMutation.mutate({ enabled: checked })}
          />
        </CardTitle>
      </CardHeader>
      {protection.enabled && (
        <CardContent className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-700 mb-3">Max Surge: {protection.max_multiplier}x</p>
            <Slider
              value={[protection.max_multiplier]}
              onValueChange={([value]) => updateMutation.mutate({ max_multiplier: value })}
              min={1.0}
              max={3.0}
              step={0.1}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1.0x</span>
              <span>3.0x</span>
            </div>
          </div>
          <p className="text-xs text-center text-gray-600">
            You'll be notified when surge exceeds your limit
          </p>
        </CardContent>
      )}
    </Card>
  );
}