import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, X, Loader2, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function SplitFare({ rideRequest, userEmail }) {
  const [participants, setParticipants] = useState([{ email: '', name: '', amount_owed: 0, paid: false }]);
  const [splitType, setSplitType] = useState('equal');
  const queryClient = useQueryClient();

  const addParticipant = () => {
    setParticipants([...participants, { email: '', name: '', amount_owed: 0, paid: false }]);
  };

  const removeParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index, field, value) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  const calculateSplit = () => {
    if (splitType === 'equal') {
      const amountPerPerson = rideRequest.estimated_price / (participants.length + 1); // +1 for creator
      return participants.map(p => ({ ...p, amount_owed: amountPerPerson }));
    }
    return participants;
  };

  const splitMutation = useMutation({
    mutationFn: async () => {
      const finalParticipants = calculateSplit();
      
      await base44.entities.RideShare.create({
        ride_request_id: rideRequest.id,
        creator_email: userEmail,
        split_participants: finalParticipants,
        total_fare: rideRequest.estimated_price,
        split_type: splitType,
        status: 'pending'
      });

      // Send emails to all participants
      for (const participant of finalParticipants) {
        if (participant.email) {
          await base44.integrations.Core.SendEmail({
            to: participant.email,
            subject: 'Ride Fare Split Request - Walla',
            body: `Hi ${participant.name || 'there'},

You've been invited to split a ride fare on Walla.

Ride Details:
- Route: ${rideRequest.pickup_location} → ${rideRequest.dropoff_location}
- Total Fare: $${rideRequest.estimated_price.toFixed(2)}
- Your Share: $${participant.amount_owed.toFixed(2)}

Please log in to Walla to complete your payment.

Best regards,
Walla Team`
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rideSplits']);
      toast.success('Fare split invitations sent!');
      setParticipants([{ email: '', name: '', amount_owed: 0, paid: false }]);
    }
  });

  const totalSplit = calculateSplit().reduce((sum, p) => sum + p.amount_owed, 0);
  const creatorAmount = rideRequest.estimated_price - totalSplit;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Split Fare
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">Share the cost of this ride with friends</p>

        {/* Split Type */}
        <div className="flex gap-2">
          <Button
            variant={splitType === 'equal' ? 'default' : 'outline'}
            onClick={() => setSplitType('equal')}
            className="flex-1 rounded-xl"
          >
            Split Equally
          </Button>
          <Button
            variant={splitType === 'custom' ? 'default' : 'outline'}
            onClick={() => setSplitType('custom')}
            className="flex-1 rounded-xl"
          >
            Custom Split
          </Button>
        </div>

        {/* Participants */}
        <div className="space-y-3">
          <AnimatePresence>
            {participants.map((participant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-gray-50 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Email"
                    value={participant.email}
                    onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                    className="flex-1 h-9 rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeParticipant(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Name"
                  value={participant.name}
                  onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                  className="h-9 rounded-lg"
                />
                {splitType === 'custom' && (
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={participant.amount_owed || ''}
                    onChange={(e) => updateParticipant(index, 'amount_owed', parseFloat(e.target.value) || 0)}
                    className="h-9 rounded-lg"
                  />
                )}
                {splitType === 'equal' && (
                  <Badge variant="outline" className="w-full justify-center">
                    ${(rideRequest.estimated_price / (participants.length + 1)).toFixed(2)} per person
                  </Badge>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Button
          variant="outline"
          onClick={addParticipant}
          className="w-full rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Person
        </Button>

        {/* Summary */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Fare</span>
            <span className="font-semibold">${rideRequest.estimated_price.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Your Share</span>
            <span className="font-semibold text-indigo-600">${creatorAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Split Among</span>
            <span className="font-semibold">{participants.length + 1} people</span>
          </div>
        </div>

        <Button
          onClick={() => splitMutation.mutate()}
          disabled={splitMutation.isPending || participants.some(p => !p.email)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-12"
        >
          {splitMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending Invites...
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 mr-2" />
              Split Fare
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}