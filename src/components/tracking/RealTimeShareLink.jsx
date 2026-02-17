import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function RealTimeShareLink({ rideRequestId }) {
  const [emails, setEmails] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  const shareMutation = useMutation({
    mutationFn: async () => {
      const emailList = emails.split(',').map(e => e.trim());
      const link = `${window.location.origin}/track-ride?id=${rideRequestId}`;
      
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);

      const result = await base44.entities.RealTimeTracking.create({
        ride_request_id: rideRequestId,
        shared_with_emails: emailList,
        share_link: link,
        expires_at: expires.toISOString(),
        tracking_enabled: true,
        update_interval_seconds: 10
      });

      setShareLink(link);
      return result;
    },
    onSuccess: () => {
      toast.success('Tracking link created!');
    }
  });

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Share2 className="w-4 h-4 text-blue-600" />
          Share Real-Time Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Email addresses (comma separated)"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
        />
        <Button onClick={() => shareMutation.mutate()} disabled={!emails} className="w-full" size="sm">
          Create Share Link
        </Button>
        {shareLink && (
          <div className="bg-blue-50 rounded p-2 space-y-2">
            <p className="text-xs text-gray-600 break-all">{shareLink}</p>
            <Button onClick={copyLink} variant="outline" size="sm" className="w-full">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}