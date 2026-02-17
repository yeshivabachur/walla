import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StarRating({ 
  rating = 0,
  onChange,
  readonly = false,
  size = 'md',
  showValue = true,
  className 
}) {
  const [hover, setHover] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const currentRating = hover || rating;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            whileHover={!readonly ? { scale: 1.2 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            className={cn(
              !readonly && 'cursor-pointer',
              readonly && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizes[size],
                star <= currentRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-none text-gray-300',
                'transition-colors duration-150'
              )}
            />
          </motion.button>
        ))}
      </div>
      
      {showValue && (
        <motion.span
          key={currentRating}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-sm font-semibold text-gray-700"
        >
          {currentRating.toFixed(1)}
        </motion.span>
      )}
    </div>
  );
}