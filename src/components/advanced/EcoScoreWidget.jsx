import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf } from 'lucide-react';

export default function EcoScoreWidget({ userEmail }) {
  const { data: ecoData } = useQuery({
    queryKey: ['ecoScore', userEmail],
    queryFn: async () => {
      const result = await base44.entities.EcoScoreTracking.filter({ user_email: userEmail });
      return result[0] || { eco_score: 0, carbon_saved: 0, tree_equivalent: 0 };
    }
  });

  if (!ecoData) return null;

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Leaf className="w-4 h-4 text-green-600" />
          Your Eco Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Eco Score</span>
          <Badge className="bg-green-600">{ecoData.eco_score}</Badge>
        </div>
        <div className="text-xs text-gray-600">
          <p>🌍 {ecoData.carbon_saved} kg CO₂ saved</p>
          <p>🌳 Equivalent to {ecoData.tree_equivalent} trees planted</p>
        </div>
      </CardContent>
    </Card>
  );
}