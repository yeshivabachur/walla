import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Award } from 'lucide-react';

export default function LoyaltyTierDisplay({ userEmail }) {
  const { data: progress } = useQuery({
    queryKey: ['loyaltyTier', userEmail],
    queryFn: async () => {
      const tiers = await base44.entities.LoyaltyTierProgress.filter({ user_email: userEmail });
      return tiers[0] || { current_tier: 'bronze', points_earned: 0, points_to_next_tier: 100 };
    }
  });

  const tierColors = {
    bronze: 'text-orange-700 bg-orange-100',
    silver: 'text-gray-700 bg-gray-100',
    gold: 'text-yellow-700 bg-yellow-100',
    platinum: 'text-purple-700 bg-purple-100',
    diamond: 'text-blue-700 bg-blue-100'
  };

  const getIcon = () => {
    if (progress?.current_tier === 'diamond') return Crown;
    if (progress?.current_tier === 'platinum') return Award;
    return Star;
  };

  const Icon = getIcon();

  if (!progress) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="w-4 h-4" />
          Loyalty Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge className={tierColors[progress.current_tier]}>
          {progress.current_tier.toUpperCase()} TIER
        </Badge>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>{progress.points_earned} pts</span>
            <span>{progress.points_to_next_tier} pts to next</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" 
                 style={{width: `${(progress.points_earned / (progress.points_earned + progress.points_to_next_tier)) * 100}%`}}></div>
          </div>
        </div>
        {progress.tier_benefits && progress.tier_benefits.length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-1">Your benefits:</p>
            {progress.tier_benefits.slice(0, 3).map((benefit, idx) => (
              <p key={idx} className="text-xs text-gray-600">• {benefit}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}