import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Gift, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function ReferralProgramCard({ userEmail }) {
  const referralCode = userEmail.split('@')[0].toUpperCase().substring(0, 6);
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const { data: referrals = [] } = useQuery({
    queryKey: ['referrals', userEmail],
    queryFn: () => base44.entities.ReferralTracking.filter({ referrer_email: userEmail })
  });

  const totalEarned = referrals.filter(r => r.reward_paid).length * 10;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Gift className="w-4 h-4 text-purple-600" />
          Referral Program
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-purple-50 rounded p-3">
          <p className="text-xs text-gray-600">Your code</p>
          <p className="text-2xl font-bold text-purple-600">{referralCode}</p>
        </div>
        <div className="flex justify-between text-sm">
          <span>Friends referred</span>
          <Badge>{referrals.length}</Badge>
        </div>
        <div className="flex justify-between text-sm">
          <span>Total earned</span>
          <Badge className="bg-green-600">${totalEarned}</Badge>
        </div>
        <Input value={referralLink} readOnly className="text-xs" />
        <Button onClick={copyLink} variant="outline" className="w-full" size="sm">
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </Button>
        <p className="text-xs text-gray-600">Give $10, Get $10 when they complete first ride</p>
      </CardContent>
    </Card>
  );
}