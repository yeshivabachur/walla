import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function RideChat({ rideRequestId, userEmail, userType }) {
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['chat', rideRequestId],
    queryFn: () => base44.entities.InAppChat.filter({ ride_request_id: rideRequestId }),
    refetchInterval: 3000
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.InAppChat.create({
        ride_request_id: rideRequestId,
        sender_email: userEmail,
        sender_type: userType,
        message,
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chat']);
      setMessage('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <MessageCircle className="w-4 h-4 text-blue-600" />
          Chat with {userType === 'passenger' ? 'Driver' : 'Passenger'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-48 overflow-y-auto space-y-2 bg-gray-50 rounded p-2">
          {messages.map(msg => (
            <div key={msg.id} className={`p-2 rounded text-sm ${
              msg.sender_email === userEmail ? 'bg-blue-100 ml-8' : 'bg-white mr-8'
            }`}>
              <p className="text-xs text-gray-600">{msg.sender_type}</p>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMutation.mutate()}
          />
          <Button onClick={() => sendMutation.mutate()} disabled={!message}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}