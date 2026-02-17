import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Leaf } from 'lucide-react';
import { toast } from 'sonner';

export default function CarpoolMatchFinder({ passengerEmail, route }) {
  const queryClient = useQueryClient();

  const { data: matches = [] } = useQuery({
    queryKey: ['carpoolMatches', route],
    queryFn: async () => {
      const all = await base44.entities.CarpoolMatch.list();
      return all.filter(m => 
        m.shared_route === route && 
        m.match_status === 'pending'
      );
    }
  });

  const acceptMutation = useMutation({
    mutationFn: async (matchId) => {
      return await base44.entities.CarpoolMatch.update(matchId, {
        match_status: 'accepted'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['carpoolMatches']);
      toast.success('Carpool match accepted!');
    }
  });

  if (matches.length === 0) return null;

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-green-600" />
          Carpool Matches Found
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {matches.slice(0, 2).map(match => (
          <div key={match.id} className="bg-white rounded p-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs font-semibold">Ride with {match.matched_passenger_email.split('@')[0]}</p>
                <p className="text-xs text-gray-600">{match.route_similarity_score}% similar route</p>
              </div>
              <Badge className="bg-green-600">
                <DollarSign className="w-3 h-3 mr-1" />
                Save ${match.cost_savings_per_person}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-700 mb-2">
              <Leaf className="w-3 h-3" />
              <span>{match.environmental_impact} kg CO₂ saved</span>
            </div>
            <Button
              onClick={() => acceptMutation.mutate(match.id)}
              size="sm"
              className="w-full"
            >
              Accept Match
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}