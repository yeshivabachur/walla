import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function GroupRideCoordinator({ userEmail, pickup, dropoff, onCreated }) {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const queryClient = useQueryClient();

  const createGroupMutation = useMutation({
    mutationFn: async () => {
      const group = await base44.entities.GroupRide.create({
        organizer_email: userEmail,
        group_name: groupName,
        pickup_location: pickup,
        dropoff_location: dropoff,
        members: members.map(email => ({
          email,
          name: email.split('@')[0],
          confirmed: false
        })),
        status: 'pending'
      });

      // Send notifications to all members
      for (const member of members) {
        await base44.integrations.Core.SendEmail({
          to: member,
          subject: `You're invited to join a group ride!`,
          body: `${userEmail} has invited you to join a group ride from ${pickup} to ${dropoff}. Check your Walla app to confirm!`
        });
      }

      return group;
    },
    onSuccess: () => {
      toast.success('Group ride created! Invitations sent.');
      queryClient.invalidateQueries(['groupRides']);
      onCreated?.();
    }
  });

  const addMember = () => {
    if (newMemberEmail && !members.includes(newMemberEmail) && newMemberEmail !== userEmail) {
      setMembers([...members, newMemberEmail]);
      setNewMemberEmail('');
    }
  };

  const removeMember = (email) => {
    setMembers(members.filter(m => m !== email));
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Create Group Ride
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-900 mb-1 block">Group Name</label>
          <Input
            placeholder="e.g., Conference Attendees"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-900 mb-1 block">Add Members</label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="member@example.com"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMember()}
              className="rounded-xl"
            />
            <Button onClick={addMember} size="icon" className="rounded-xl">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {members.map((email) => (
              <div key={email} className="bg-gray-50 rounded-lg p-2 flex items-center justify-between">
                <span className="text-sm">{email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMember(email)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => createGroupMutation.mutate()}
          disabled={!groupName || members.length === 0 || createGroupMutation.isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl"
        >
          Create Group Ride
        </Button>

        <p className="text-xs text-center text-gray-500">
          Members will receive email invitations and can confirm in the app
        </p>
      </CardContent>
    </Card>
  );
}