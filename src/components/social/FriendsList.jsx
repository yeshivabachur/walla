import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function FriendsList({ userEmail }) {
  const [searchEmail, setSearchEmail] = React.useState('');
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['socialProfile', userEmail],
    queryFn: async () => {
      const profiles = await base44.entities.SocialProfile.filter({ user_email: userEmail });
      if (profiles[0]) return profiles[0];
      
      return await base44.entities.SocialProfile.create({
        user_email: userEmail,
        display_name: userEmail.split('@')[0],
        friends: [],
        friend_requests: []
      });
    },
    enabled: !!userEmail
  });

  const sendRequestMutation = useMutation({
    mutationFn: async (targetEmail) => {
      const targetProfiles = await base44.entities.SocialProfile.filter({ user_email: targetEmail });
      if (!targetProfiles[0]) {
        throw new Error('User not found');
      }

      const targetProfile = targetProfiles[0];
      await base44.entities.SocialProfile.update(targetProfile.id, {
        friend_requests: [
          ...targetProfile.friend_requests,
          { from_email: userEmail, status: 'pending' }
        ]
      });
    },
    onSuccess: () => {
      toast.success('Friend request sent!');
      setSearchEmail('');
    },
    onError: () => {
      toast.error('Could not send request');
    }
  });

  const respondToRequestMutation = useMutation({
    mutationFn: async ({ requestEmail, accept }) => {
      if (accept) {
        // Add to both friend lists
        await base44.entities.SocialProfile.update(profile.id, {
          friends: [...profile.friends, requestEmail],
          friend_requests: profile.friend_requests.filter(r => r.from_email !== requestEmail)
        });

        const friendProfiles = await base44.entities.SocialProfile.filter({ user_email: requestEmail });
        if (friendProfiles[0]) {
          await base44.entities.SocialProfile.update(friendProfiles[0].id, {
            friends: [...friendProfiles[0].friends, userEmail]
          });
        }
      } else {
        await base44.entities.SocialProfile.update(profile.id, {
          friend_requests: profile.friend_requests.filter(r => r.from_email !== requestEmail)
        });
      }
    },
    onSuccess: (_, { accept }) => {
      queryClient.invalidateQueries(['socialProfile']);
      toast.success(accept ? 'Friend added!' : 'Request declined');
    }
  });

  if (!profile) return null;

  const pendingRequests = profile.friend_requests?.filter(r => r.status === 'pending') || [];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Friends ({profile.friends?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingRequests.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-900">Friend Requests</p>
            {pendingRequests.map((req, i) => (
              <div key={i} className="flex items-center justify-between bg-blue-50 rounded-xl p-3">
                <span className="text-sm">{req.from_email}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => respondToRequestMutation.mutate({ requestEmail: req.from_email, accept: true })}
                    className="rounded-lg bg-green-600 hover:bg-green-700 h-8"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => respondToRequestMutation.mutate({ requestEmail: req.from_email, accept: false })}
                    className="rounded-lg h-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">Add Friend</p>
          <div className="flex gap-2">
            <Input
              placeholder="friend@example.com"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="rounded-xl"
            />
            <Button
              onClick={() => sendRequestMutation.mutate(searchEmail)}
              disabled={!searchEmail || sendRequestMutation.isPending}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {profile.friends?.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-900">My Friends</p>
            <div className="space-y-2">
              {profile.friends.map((friend, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm">{friend}</span>
                  <Badge className="bg-green-100 text-green-800">Friends</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}