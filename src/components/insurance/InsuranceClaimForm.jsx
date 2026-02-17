import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function InsuranceClaimForm({ rideRequestId, userEmail }) {
  const [claimType, setClaimType] = useState('accident');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const claimMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.InsuranceClaim.create({
        ride_request_id: rideRequestId,
        claimant_email: userEmail,
        claim_type: claimType,
        incident_description: description,
        estimated_amount: parseFloat(amount),
        status: 'filed',
        documentation: []
      });
    },
    onSuccess: () => {
      toast.success('Insurance claim filed successfully');
      setDescription('');
      setAmount('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-blue-600" />
          File Insurance Claim
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={claimType} onValueChange={setClaimType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="accident">Accident</SelectItem>
            <SelectItem value="injury">Injury</SelectItem>
            <SelectItem value="property_damage">Property Damage</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Describe the incident"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <Input
          type="number"
          placeholder="Estimated amount ($)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button
          onClick={() => claimMutation.mutate()}
          disabled={!description || !amount}
          className="w-full"
          size="sm"
        >
          Submit Claim
        </Button>
      </CardContent>
    </Card>
  );
}