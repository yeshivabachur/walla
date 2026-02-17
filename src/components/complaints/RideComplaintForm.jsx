import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function RideComplaintForm({ rideRequestId, userEmail }) {
  const [type, setType] = useState('other');
  const [description, setDescription] = useState('');

  const submitMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.RideComplaint.create({
        ride_request_id: rideRequestId,
        complainant_email: userEmail,
        complaint_type: type,
        description,
        severity: 'medium',
        status: 'submitted'
      });
    },
    onSuccess: () => {
      toast.success('Complaint submitted. We will review it.');
      setDescription('');
    }
  });

  return (
    <Card className="border-2 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          Report Issue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unsafe_driving">Unsafe Driving</SelectItem>
            <SelectItem value="unprofessional">Unprofessional Behavior</SelectItem>
            <SelectItem value="route_issue">Route Issue</SelectItem>
            <SelectItem value="cleanliness">Cleanliness</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <Button 
          onClick={() => submitMutation.mutate()} 
          disabled={!description}
          className="w-full bg-red-600"
          size="sm"
        >
          Submit Complaint
        </Button>
      </CardContent>
    </Card>
  );
}