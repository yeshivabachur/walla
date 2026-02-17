import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Copy, Users, DollarSign, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ReferralProgram({ userEmail }) {
  const [referralCode, setReferralCode] = useState(null);
  const queryClient = useQueryClient();

  const { data: referrals = [] } = useQuery({
    queryKey: ['referrals', userEmail],
    queryFn: () => base44.entities.Referral.filter({ referrer_email: userEmail }),
    enabled: !!userEmail
  });

  const createCodeMutation = useMutation({
    mutationFn: async () => {
      const code = userEmail.split('@')[0].toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
      await base44.entities.Referral.create({
        referrer_email: userEmail,
        referral_code: code,
        status: 'pending',
        reward_amount: 10
      });
      return code;
    },
    onSuccess: (code) => {
      setReferralCode(code);
      queryClient.invalidateQueries(['referrals']);
      toast.success('Referral code created!');
    }
  });

  React.useEffect(() => {
    if (referrals.length > 0 && !referralCode) {
      setReferralCode(referrals[0].referral_code);
    }
  }, [referrals, referralCode]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  const completedReferrals = referrals.filter(r => r.status === 'completed');
  const totalEarned = completedReferrals.reduce((sum, r) => sum + r.reward_amount, 0);

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-purple-600" />
          Refer & Earn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Invite friends and you both get <strong>$10 credit</strong>!
          </p>
          
          {referralCode ? (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-white">
                <p className="text-xs mb-1">Your Referral Code</p>
                <p className="text-3xl font-bold tracking-wider">{referralCode}</p>
              </div>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full rounded-xl"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => createCodeMutation.mutate()}
              disabled={createCodeMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl"
            >
              Generate Referral Code
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-gray-600">Referrals</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{completedReferrals.length}</p>
          </div>

          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">Earned</span>
            </div>
            <p className="text-2xl font-bold text-green-600">${totalEarned}</p>
          </div>
        </div>

        {completedReferrals.length > 0 && (
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-700 mb-2">Recent Referrals</p>
            <div className="space-y-2">
              {completedReferrals.slice(0, 3).map((ref) => (
                <div key={ref.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{ref.referred_email}</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    ${ref.reward_amount}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}