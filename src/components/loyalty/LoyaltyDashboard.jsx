import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, Crown, Star, Zap, Gift, TrendingUp, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const TIER_CONFIG = {
  bronze: {
    name: 'Bronze',
    color: 'from-orange-600 to-orange-400',
    icon: Award,
    minPoints: 0,
    perks: ['Standard support', 'Weekly insights'],
    commissionRate: 0.20
  },
  silver: {
    name: 'Silver',
    color: 'from-gray-400 to-gray-300',
    icon: Star,
    minPoints: 500,
    perks: ['Priority support', 'Weekly insights', '18% commission'],
    commissionRate: 0.18
  },
  gold: {
    name: 'Gold',
    color: 'from-yellow-500 to-yellow-400',
    icon: Crown,
    minPoints: 1500,
    perks: ['Priority support', 'Daily insights', '15% commission', 'Early feature access'],
    commissionRate: 0.15
  },
  platinum: {
    name: 'Platinum',
    color: 'from-purple-600 to-pink-500',
    icon: Zap,
    minPoints: 3000,
    perks: ['VIP support', 'Real-time insights', '12% commission', 'All feature access', 'Exclusive events'],
    commissionRate: 0.12
  }
};

export default function LoyaltyDashboard({ driverEmail }) {
  const queryClient = useQueryClient();

  const { data: loyalty, isLoading } = useQuery({
    queryKey: ['driverLoyalty', driverEmail],
    queryFn: async () => {
      const loyalties = await base44.entities.DriverLoyalty.filter({ driver_email: driverEmail });
      if (loyalties.length === 0) {
        // Create initial loyalty record
        return await base44.entities.DriverLoyalty.create({ driver_email: driverEmail });
      }
      return loyalties[0];
    },
    enabled: !!driverEmail
  });

  const { data: performance } = useQuery({
    queryKey: ['driverPerformance', driverEmail],
    queryFn: async () => {
      const perf = await base44.entities.DriverPerformance.filter({ driver_email: driverEmail });
      return perf[0];
    },
    enabled: !!driverEmail
  });

  const updateLoyaltyMutation = useMutation({
    mutationFn: async (updates) => {
      return await base44.entities.DriverLoyalty.update(loyalty.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['driverLoyalty']);
      toast.success('Loyalty status updated!');
    }
  });

  // Calculate points based on performance
  useEffect(() => {
    if (!performance || !loyalty) return;

    const calculatePoints = () => {
      let points = 0;
      
      // Points from rides (10 points per completed ride)
      points += performance.completed_rides * 10;
      
      // Bonus for high ratings (up to 500 points)
      if (performance.average_rating >= 4.9) points += 500;
      else if (performance.average_rating >= 4.7) points += 300;
      else if (performance.average_rating >= 4.5) points += 100;
      
      // Bonus for streaks (100 points per week)
      points += Math.floor(performance.current_streak / 7) * 100;
      
      // Bonus for efficiency (up to 300 points)
      if (performance.efficiency_score >= 95) points += 300;
      else if (performance.efficiency_score >= 90) points += 200;
      else if (performance.efficiency_score >= 85) points += 100;
      
      return points;
    };

    const newPoints = calculatePoints();
    
    // Determine tier
    let newTier = 'bronze';
    if (newPoints >= TIER_CONFIG.platinum.minPoints) newTier = 'platinum';
    else if (newPoints >= TIER_CONFIG.gold.minPoints) newTier = 'gold';
    else if (newPoints >= TIER_CONFIG.silver.minPoints) newTier = 'silver';

    // Calculate progress to next tier
    const currentTierConfig = TIER_CONFIG[newTier];
    const nextTierKey = newTier === 'bronze' ? 'silver' : newTier === 'silver' ? 'gold' : newTier === 'gold' ? 'platinum' : null;
    const nextTierPoints = nextTierKey ? TIER_CONFIG[nextTierKey].minPoints : null;
    const tierProgress = nextTierPoints 
      ? Math.min(((newPoints - currentTierConfig.minPoints) / (nextTierPoints - currentTierConfig.minPoints)) * 100, 100)
      : 100;

    if (newPoints !== loyalty.points || newTier !== loyalty.tier) {
      updateLoyaltyMutation.mutate({
        points: newPoints,
        tier: newTier,
        tier_progress: tierProgress,
        commission_rate: TIER_CONFIG[newTier].commissionRate,
        perks: TIER_CONFIG[newTier].perks
      });
    }
  }, [performance, loyalty]);

  if (isLoading || !loyalty) {
    return <div>Loading...</div>;
  }

  const currentTierConfig = TIER_CONFIG[loyalty.tier];
  const TierIcon = currentTierConfig.icon;
  const nextTierKey = loyalty.tier === 'bronze' ? 'silver' : loyalty.tier === 'silver' ? 'gold' : loyalty.tier === 'gold' ? 'platinum' : null;
  const nextTierConfig = nextTierKey ? TIER_CONFIG[nextTierKey] : null;

  return (
    <div className="space-y-6">
      {/* Current Tier Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className={`border-0 shadow-lg bg-gradient-to-br ${currentTierConfig.color} text-white`}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <TierIcon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Current Tier</p>
                  <h2 className="text-3xl font-bold">{currentTierConfig.name}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{loyalty.points}</p>
                <p className="text-sm opacity-90">Points</p>
              </div>
            </div>

            {nextTierConfig && (
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progress to {nextTierConfig.name}</span>
                  <span>{Math.round(loyalty.tier_progress)}%</span>
                </div>
                <Progress value={loyalty.tier_progress} className="h-2 bg-white/20" />
                <p className="text-xs mt-2 opacity-80">
                  {nextTierConfig.minPoints - loyalty.points} points to next tier
                </p>
              </div>
            )}
            {!nextTierConfig && (
              <div className="text-center py-2">
                <Badge className="bg-white/20 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Highest Tier Achieved!
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Perks */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-indigo-600" />
            Your Perks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {currentTierConfig.perks.map((perk, idx) => (
              <div key={idx} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Zap className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-sm text-gray-700">{perk}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Tiers */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Loyalty Tiers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(TIER_CONFIG).map(([key, config]) => {
            const TierIconComp = config.icon;
            const isUnlocked = loyalty.points >= config.minPoints;
            const isCurrent = loyalty.tier === key;

            return (
              <div
                key={key}
                className={`p-4 rounded-xl border-2 ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-50'
                    : isUnlocked
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white`}>
                      <TierIconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{config.name}</h3>
                      <p className="text-xs text-gray-500">{config.minPoints}+ points</p>
                    </div>
                  </div>
                  {isCurrent && (
                    <Badge className="bg-indigo-600">Current</Badge>
                  )}
                  {!isUnlocked && (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="space-y-1">
                  {config.perks.map((perk, idx) => (
                    <p key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="text-gray-400">•</span> {perk}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}