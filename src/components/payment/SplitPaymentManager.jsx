import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function SplitPaymentManager({ rideRequestId, totalAmount }) {
  const [participants, setParticipants] = useState([]);
  const [email, setEmail] = useState('');
  const queryClient = useQueryClient();

  const addParticipant = () => {
    if (email) {
      setParticipants([...participants, { email, amount: 0, paid: false }]);
      setEmail('');
    }
  };

  const removeParticipant = (idx) => {
    setParticipants(participants.filter((_, i) => i !== idx));
  };

  const splitEqually = () => {
    const perPerson = totalAmount / (participants.length + 1);
    setParticipants(participants.map(p => ({ ...p, amount: perPerson })));
  };

  const splitMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.SplitPayment.create({
        ride_request_id: rideRequestId,
        total_amount: totalAmount,
        split_method: 'custom',
        participants,
        status: 'pending'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['splitPayments']);
      toast.success('Payment split created!');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-green-600" />
          Split Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-green-50 rounded p-2">
          <p className="text-lg font-bold text-green-600">${totalAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-600">Total Amount</p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add participant email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={addParticipant} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {participants.length > 0 && (
          <>
            <Button onClick={splitEqually} variant="outline" size="sm" className="w-full">
              Split Equally
            </Button>
            <div className="space-y-2">
              {participants.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 rounded p-2">
                  <span className="text-xs">{p.email}</span>
                  <div className="flex items-center gap-2">
                    <Badge>${p.amount.toFixed(2)}</Badge>
                    <Button onClick={() => removeParticipant(idx)} variant="ghost" size="sm">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={() => splitMutation.mutate()}
              disabled={participants.length === 0}
              className="w-full"
            >
              Send Split Requests
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}