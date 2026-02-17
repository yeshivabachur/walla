import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function DriverReferralProgram({ driverEmail }) {
  const queryClient = useQueryClient();
  const [refereeEmail, setRefereeEmail] = useState('');

  const { data: referrals = [] } = useQuery({
    queryKey: ['driverReferrals', driverEmail],
    queryFn: () => base44.entities.DriverReferral.filter({ referrer_email: driverEmail })
  });

  const referMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.DriverReferral.create({
        referrer_email: driverEmail,
        referee_email: refereeEmail,
        status: 'pending',
        bonus_amount: 100
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['driverReferrals']);
      toast.success('Referral sent!');
      setRefereeEmail('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-blue-600" />
          Refer a Driver
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Driver email..."
            value={refereeEmail}
            onChange={(e) => setRefereeEmail(e.target.value)}
          />
          <Button onClick={() => referMutation.mutate()}>
            Refer
          </Button>
        </div>
        <p className="text-xs text-gray-600">
          Earn $100 when they complete 10 rides!
        </p>
        {referrals.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-semibold">Your Referrals:</p>
            {referrals.map(r => (
              <div key={r.id} className="text-xs text-gray-700">
                {r.referee_email} - {r.status}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}