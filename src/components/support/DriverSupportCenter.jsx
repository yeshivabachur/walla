import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function DriverSupportCenter({ driverEmail }) {
  const queryClient = useQueryClient();
  const [supportType, setSupportType] = useState('general');
  const [issue, setIssue] = useState('');

  const submitMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.DriverSupport.create({
        driver_email: driverEmail,
        support_type: supportType,
        issue_description: issue,
        status: 'open',
        priority: 'medium'
      });
    },
    onSuccess: () => {
      toast.success('Support ticket created');
      setIssue('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          Get Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Select value={supportType} onValueChange={setSupportType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="payment">Payment</SelectItem>
            <SelectItem value="safety">Safety</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Describe your issue..."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          rows={3}
        />
        <Button
          onClick={() => submitMutation.mutate()}
          disabled={!issue.trim()}
          className="w-full"
          size="sm"
        >
          Submit Ticket
        </Button>
      </CardContent>
    </Card>
  );
}