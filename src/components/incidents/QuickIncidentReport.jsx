import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function QuickIncidentReport({ rideRequestId, userEmail }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('safety_concern');
  const [description, setDescription] = useState('');

  const reportMutation = useMutation({
    mutationFn: async () => {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze incident report: ${type} - ${description}. Provide brief risk assessment.`,
        response_json_schema: {
          type: 'object',
          properties: {
            severity: { type: 'string' },
            analysis: { type: 'string' }
          }
        }
      });

      return await base44.entities.IncidentReport.create({
        ride_request_id: rideRequestId,
        reporter_email: userEmail,
        incident_type: type,
        severity: analysis.severity,
        description,
        ai_analysis: analysis.analysis
      });
    },
    onSuccess: () => {
      toast.success('Report submitted. Support will contact you shortly.');
      setOpen(false);
      setDescription('');
    }
  });

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="border-red-300 text-red-600 hover:bg-red-50"
      >
        <AlertTriangle className="w-4 h-4 mr-1" />
        Report Issue
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Incident</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="safety_concern">Safety Concern</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="vehicle_issue">Vehicle Issue</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Describe what happened..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />

            <Button
              onClick={() => reportMutation.mutate()}
              disabled={!description || reportMutation.isPending}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Submit Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}