import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function CommunityEventsHub({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: events = [] } = useQuery({
    queryKey: ['communityEvents'],
    queryFn: () => base44.entities.CommunityEvent.filter({ status: 'active' })
  });

  const joinEventMutation = useMutation({
    mutationFn: async (eventId) => {
      const event = events.find(e => e.id === eventId);
      const participants = event.participants || [];
      
      await base44.entities.CommunityEvent.update(eventId, {
        participants: [...participants, userEmail]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['communityEvents']);
      toast.success('Joined event successfully!');
    }
  });

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Community Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-4">
            No active events at the moment
          </p>
        ) : (
          events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                <Badge className="bg-purple-600 text-white capitalize">
                  {event.event_type}
                </Badge>
              </div>
              
              <p className="text-xs text-gray-600 mb-2">{event.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>{event.participants?.length || 0} joined</span>
                  {event.rewards?.points && (
                    <>
                      <Gift className="w-3 h-3 ml-2" />
                      <span>{event.rewards.points} pts</span>
                    </>
                  )}
                </div>
                
                <Button
                  size="sm"
                  onClick={() => joinEventMutation.mutate(event.id)}
                  disabled={event.participants?.includes(userEmail)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {event.participants?.includes(userEmail) ? 'Joined' : 'Join'}
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}