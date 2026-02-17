import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from 'lucide-react';
import { toast } from 'sonner';

export default function PassengerGroupManager({ userEmail }) {
  const queryClient = useQueryClient();
  const [groupName, setGroupName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');

  const { data: groups = [] } = useQuery({
    queryKey: ['passengerGroups', userEmail],
    queryFn: () => base44.entities.PassengerGroup.filter({ admin_email: userEmail })
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.PassengerGroup.create({
        group_name: groupName,
        admin_email: userEmail,
        member_emails: [],
        shared_payment: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['passengerGroups']);
      toast.success('Group created');
      setGroupName('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-purple-600" />
          Travel Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Button onClick={() => createMutation.mutate()} disabled={!groupName} size="sm">
            Create
          </Button>
        </div>
        {groups.map(g => (
          <div key={g.id} className="bg-purple-50 rounded p-2">
            <p className="text-sm font-semibold">{g.group_name}</p>
            <p className="text-xs text-gray-600">{g.member_emails.length} members</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}