import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Heart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const TIP_PRESETS = [
  { label: '10%', value: 0.10 },
  { label: '15%', value: 0.15 },
  { label: '20%', value: 0.20 },
  { label: '25%', value: 0.25 }
];

export default function TipDriver({ rideRequest, onTipSubmitted }) {
  const [selectedPreset, setSelectedPreset] = useState(0.15);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const queryClient = useQueryClient();

  const tipMutation = useMutation({
    mutationFn: async () => {
      const tipAmount = isCustom 
        ? parseFloat(customAmount) 
        : rideRequest.estimated_price * selectedPreset;

      await base44.entities.RideTip.create({
        ride_request_id: rideRequest.id,
        passenger_email: rideRequest.passenger_email,
        driver_email: rideRequest.driver_email,
        amount: tipAmount,
        tip_type: isCustom ? 'fixed' : 'percentage',
        message: message
      });

      // Notify driver
      await base44.integrations.Core.SendEmail({
        to: rideRequest.driver_email,
        subject: 'You received a tip! 🎉',
        body: `Great news! ${rideRequest.passenger_name} tipped you $${tipAmount.toFixed(2)}.
        
${message ? `Message: "${message}"` : ''}

Keep up the excellent service!

Walla Team`
      });

      return tipAmount;
    },
    onSuccess: (tipAmount) => {
      queryClient.invalidateQueries(['rideTips']);
      toast.success(`Tip of $${tipAmount.toFixed(2)} sent! Thank you for your generosity.`);
      if (onTipSubmitted) onTipSubmitted();
    }
  });

  const calculatedTip = isCustom 
    ? parseFloat(customAmount) || 0 
    : rideRequest.estimated_price * selectedPreset;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Tip Your Driver
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Show your appreciation for {rideRequest.driver_name}'s great service
          </p>

          {/* Preset Tips */}
          {!isCustom && (
            <div className="grid grid-cols-4 gap-2">
              {TIP_PRESETS.map((preset) => (
                <Button
                  key={preset.value}
                  variant={selectedPreset === preset.value ? 'default' : 'outline'}
                  onClick={() => setSelectedPreset(preset.value)}
                  className="rounded-xl"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          )}

          {/* Custom Amount */}
          {isCustom && (
            <div>
              <Input
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="rounded-xl"
              />
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCustom(!isCustom)}
            className="w-full"
          >
            {isCustom ? 'Use preset tips' : 'Enter custom amount'}
          </Button>

          {/* Message */}
          <Textarea
            placeholder="Add a note for your driver (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-xl resize-none"
            rows={2}
          />

          {/* Tip Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tip Amount</span>
              <span className="text-2xl font-bold text-green-600">
                ${calculatedTip.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            onClick={() => tipMutation.mutate()}
            disabled={tipMutation.isPending || calculatedTip <= 0}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl h-12"
          >
            {tipMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                Send Tip
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            100% of your tip goes directly to your driver
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}