import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ShiftSwapBoard({ driverEmail }) {
  const queryClient = useQueryClient();

  const { data: swapRequests = [] } = useQuery({
    queryKey: ['shiftSwaps', driverEmail],
    queryFn: () => base44.entities.ShiftSwap.filter({ target_driver: driverEmail, status: 'pending' })
  });

  const respondMutation = useMutation({
    mutationFn: async ({ swapId, response }) => {
      await base44.entities.ShiftSwap.update(swapId, { status: response });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shiftSwaps']);
      toast.success('Response sent');
    }
  });

  if (swapRequests.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-orange-600" />
          Shift Swap Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {swapRequests.map(swap => (
          <div key={swap.id} className="bg-orange-50 rounded p-2">
            <p className="text-sm font-semibold">
              {new Date(swap.shift_date).toLocaleDateString()} at {swap.shift_time}
            </p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={() => respondMutation.mutate({ swapId: swap.id, response: 'accepted' })}>
                <Check className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => respondMutation.mutate({ swapId: swap.id, response: 'declined' })}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}