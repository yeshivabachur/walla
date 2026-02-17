import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareTripButton({ rideId, bookingId }) {
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}${window.location.pathname}?page=TrackRide&id=${rideId}&booking=${bookingId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Track My Ride',
          text: 'Follow my ride in real-time!',
          url: shareUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          setShowDialog(true);
        }
      }
    } else {
      setShowDialog(true);
    }
  };

  return (
    <>
      <Button
        onClick={handleShare}
        variant="outline"
        className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share Trip
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Share Your Trip</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              Share this link with friends or family to let them track your ride in real-time.
            </p>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="rounded-xl"
              />
              <Button
                onClick={handleCopy}
                variant="outline"
                className="rounded-xl shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}