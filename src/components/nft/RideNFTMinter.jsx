import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RideNFTMinter({ rideRequest, userEmail }) {
  const [specialMoment, setSpecialMoment] = useState('');
  const queryClient = useQueryClient();

  const mintMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.RideNFT.create({
        ride_request_id: rideRequest.id,
        owner_email: userEmail,
        nft_metadata: {
          route: `${rideRequest.pickup_location} → ${rideRequest.dropoff_location}`,
          date: new Date(rideRequest.created_date).toLocaleDateString(),
          special_moment: specialMoment,
          image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'
        },
        minted: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rideNFTs']);
      toast.success('🎨 Ride NFT minted successfully!');
      setSpecialMoment('');
    }
  });

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Sparkles className="w-5 h-5" />
          Mint Ride Memory as NFT
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-700">
          Immortalize this special ride on the blockchain!
        </p>
        <Input
          placeholder="What made this ride special?"
          value={specialMoment}
          onChange={(e) => setSpecialMoment(e.target.value)}
          className="rounded-xl"
        />
        <Button
          onClick={() => mintMutation.mutate()}
          disabled={mintMutation.isPending || !specialMoment}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {mintMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Minting...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Mint NFT
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}