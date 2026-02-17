import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Leaf, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function CarbonOffsetProgram({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: offsetData } = useQuery({
    queryKey: ['carbonOffset', userEmail],
    queryFn: async () => {
      const offsets = await base44.entities.CarbonOffset.filter({ user_email: userEmail });
      return offsets[0];
    },
    enabled: !!userEmail
  });

  const createOffsetMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.CarbonOffset.create({
        user_email: userEmail,
        total_co2_offset_kg: 0,
        trees_planted: 0,
        auto_offset: true,
        monthly_contribution: 5
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['carbonOffset']);
      toast.success('Carbon offset program activated! 🌱');
    }
  });

  const toggleAutoOffsetMutation = useMutation({
    mutationFn: async (enabled) => {
      await base44.entities.CarbonOffset.update(offsetData.id, {
        auto_offset: enabled
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['carbonOffset']);
    }
  });

  if (!offsetData) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-8 text-center">
          <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Offset Your Carbon</h3>
          <p className="text-gray-600 mb-4">
            Automatically offset CO₂ emissions from your rides by planting trees
          </p>
          <Button
            onClick={() => createOffsetMutation.mutate()}
            disabled={createOffsetMutation.isPending}
            className="bg-green-600 hover:bg-green-700 rounded-xl"
          >
            <Leaf className="w-4 h-4 mr-2" />
            Start Offsetting ($5/month)
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Carbon Offset
            </span>
            <Badge className="bg-green-600 text-white">
              {offsetData.trees_planted} 🌳
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">CO₂ Offset</p>
              <p className="text-2xl font-bold text-green-600">
                {offsetData.total_co2_offset_kg.toFixed(1)} kg
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Trees Planted</p>
              <p className="text-2xl font-bold text-green-600">
                {offsetData.trees_planted}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Auto-Offset Rides</p>
              <p className="text-sm text-gray-600">${offsetData.monthly_contribution}/month</p>
            </div>
            <Switch
              checked={offsetData.auto_offset}
              onCheckedChange={(checked) => toggleAutoOffsetMutation.mutate(checked)}
            />
          </div>

          <div className="bg-green-100 rounded-xl p-4">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              You're making a positive impact! Keep it up 🌍
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}