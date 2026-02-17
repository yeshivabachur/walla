import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Glasses } from 'lucide-react';
import { toast } from 'sonner';

export default function ARNavigationToggle({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: arSettings } = useQuery({
    queryKey: ['arNav', userEmail],
    queryFn: async () => {
      const settings = await base44.entities.ARNavigation.filter({ user_email: userEmail });
      if (settings[0]) return settings[0];
      return await base44.entities.ARNavigation.create({ user_email: userEmail });
    },
    enabled: !!userEmail
  });

  const toggleMutation = useMutation({
    mutationFn: async (enabled) => {
      return await base44.entities.ARNavigation.update(arSettings.id, { ar_enabled: enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['arNav']);
      toast.success('AR Navigation settings updated');
    }
  });

  if (!arSettings) return null;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Glasses className="w-4 h-4 text-indigo-600" />
          AR Navigation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Enable AR View</span>
          <Switch
            checked={arSettings.ar_enabled}
            onCheckedChange={(checked) => toggleMutation.mutate(checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}