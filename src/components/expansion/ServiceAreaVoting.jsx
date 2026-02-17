import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, ThumbsUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

export default function ServiceAreaVoting({ userEmail }) {
  const queryClient = useQueryClient();
  const [newArea, setNewArea] = useState('');

  const { data: requests = [] } = useQuery({
    queryKey: ['serviceAreaRequests'],
    queryFn: () => base44.entities.ServiceAreaRequest.list('-supporting_votes')
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.ServiceAreaRequest.create({
        requester_email: userEmail,
        requested_area: newArea,
        demand_estimate: 1,
        supporting_votes: [userEmail],
        status: 'submitted'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['serviceAreaRequests']);
      toast.success('Area request submitted');
      setNewArea('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-blue-600" />
          Request Service Area
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="City or area name"
            value={newArea}
            onChange={(e) => setNewArea(e.target.value)}
          />
          <Button onClick={() => submitMutation.mutate()} disabled={!newArea} size="sm">
            Submit
          </Button>
        </div>
        {requests.slice(0, 3).map(req => (
          <div key={req.id} className="flex justify-between items-center bg-blue-50 rounded p-2">
            <span className="text-xs font-semibold">{req.requested_area}</span>
            <Badge>
              <ThumbsUp className="w-3 h-3 mr-1" />
              {req.supporting_votes?.length || 0}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}