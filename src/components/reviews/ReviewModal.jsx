import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  revieweeEmail,
  revieweeName,
  reviewerType, // "driver" or "passenger"
  isSubmitting 
}) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            Rate {reviewerType === 'passenger' ? 'Driver' : 'Passenger'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              How was your experience with <span className="font-semibold">{revieweeName}</span>?
            </p>
            
            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            
            {rating > 0 && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-500"
              >
                {rating === 5 && '⭐ Excellent!'}
                {rating === 4 && '👍 Great!'}
                {rating === 3 && '👌 Good'}
                {rating === 2 && '😐 Could be better'}
                {rating === 1 && '😞 Not great'}
              </motion.p>
            )}
          </div>

          {/* Comment */}
          <div>
            <Label className="text-gray-700 mb-2 block">
              Share more details (optional)
            </Label>
            <Textarea
              placeholder={
                reviewerType === 'passenger'
                  ? 'Tell us about your ride...'
                  : 'Tell us about your passenger...'
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded-xl resize-none"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}