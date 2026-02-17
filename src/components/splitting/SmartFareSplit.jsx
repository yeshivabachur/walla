import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function SmartFareSplit({ rideRequest, userEmail }) {
  const [participants, setParticipants] = useState([
    { email: '', name: '', amount: 0 }
  ]);
  const queryClient = useQueryClient();

  const addParticipant = () => {
    setParticipants([...participants, { email: '', name: '', amount: 0 }]);
  };

  const removeParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const calculateEqual = () => {
    const amount = rideRequest.estimated_price / (participants.length + 1);
    setParticipants(participants.map(p => ({ ...p, amount: amount.toFixed(2) })));
  };

  const createSplitMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.FareSplit.create({
        ride_request_id: rideRequest.id,
        initiator_email: userEmail,
        total_fare: rideRequest.estimated_price,
        split_method: 'equal',
        participants: participants.map(p => ({
          ...p,
          amount: parseFloat(p.amount),
          paid: false
        }))
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['fareSplit']);
      toast.success('Split requests sent!');
    }
  });

  return (
    <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Split Fare
          </span>
          <Badge className="bg-blue-600 text-white">
            ${rideRequest.estimated_price}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={calculateEqual}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Split Equally
        </Button>

        {participants.map((participant, idx) => (
          <div key={idx} className="bg-white rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Person {idx + 1}</span>
              {participants.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeParticipant(idx)}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            <Input
              placeholder="Name"
              value={participant.name}
              onChange={(e) => {
                const updated = [...participants];
                updated[idx].name = e.target.value;
                setParticipants(updated);
              }}
            />
            <Input
              placeholder="Email"
              type="email"
              value={participant.email}
              onChange={(e) => {
                const updated = [...participants];
                updated[idx].email = e.target.value;
                setParticipants(updated);
              }}
            />
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Amount"
                type="number"
                value={participant.amount}
                onChange={(e) => {
                  const updated = [...participants];
                  updated[idx].amount = e.target.value;
                  setParticipants(updated);
                }}
              />
            </div>
          </div>
        ))}

        <Button
          onClick={addParticipant}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Person
        </Button>

        <Button
          onClick={() => createSplitMutation.mutate()}
          disabled={createSplitMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Send Split Requests
        </Button>
      </CardContent>
    </Card>
  );
}