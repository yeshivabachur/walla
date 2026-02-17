import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Share2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function FamilyRideTracker({ rideRequest, userEmail }) {
  const [email, setEmail] = useState('');
  const [sharedWith, setSharedWith] = useState([]);
  const queryClient = useQueryClient();

  const shareMutation = useMutation({
    mutationFn: async () => {
      const shareToken = Math.random().toString(36).substring(7);
      
      await base44.entities.RideShare.create({
        ride_request_id: rideRequest.id,
        sharer_email: userEmail,
        shared_with: [
          ...sharedWith,
          { email, name: email.split('@')[0], can_track: true }
        ],
        share_token: shareToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        active: true
      });

      await base44.integrations.Core.SendEmail({
        to: email,
        subject: '🚗 Live Ride Tracking Shared',
        body: `Someone has shared their live ride with you!

From: ${rideRequest.pickup_location}
To: ${rideRequest.dropoff_location}

Track the ride in real-time: ${window.location.origin}/track/${shareToken}

This link expires in 24 hours.`
      });
    },
    onSuccess: () => {
      setSharedWith([...sharedWith, { email, name: email.split('@')[0], can_track: true }]);
      setEmail('');
      toast.success('Ride shared! They can now track in real-time.');
      queryClient.invalidateQueries(['rideShares']);
    }
  });

  return (
    <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" />
          Share Ride with Family
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="friend@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={() => shareMutation.mutate()}
            disabled={!email || shareMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>

        {sharedWith.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">Shared with:</p>
            {sharedWith.map((person, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg p-2 flex items-center justify-between"
              >
                <span className="text-sm text-gray-900">{person.name}</span>
                <Badge className="bg-green-100 text-green-800">
                  <Eye className="w-3 h-3 mr-1" />
                  Tracking
                </Badge>
              </motion.div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-lg p-3 text-xs text-gray-600">
          🔒 Shared links expire after 24 hours for your safety
        </div>
      </CardContent>
    </Card>
  );
}