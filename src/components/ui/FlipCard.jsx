import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './card';
import { cn } from '@/lib/utils';

export default function FlipCard({ 
  front, 
  back,
  className 
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={cn('perspective-1000 cursor-pointer', className)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Front */}
        <Card
          className="absolute inset-0 backface-hidden shadow-xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </Card>
        
        {/* Back */}
        <Card
          className="absolute inset-0 backface-hidden shadow-xl"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {back}
        </Card>
      </motion.div>
    </div>
  );
}