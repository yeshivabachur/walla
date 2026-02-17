import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Popover3D({ 
  trigger,
  content,
  position = 'bottom',
  className 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const animations = {
    top: { y: 10, rotateX: -15 },
    bottom: { y: -10, rotateX: 15 },
    left: { x: 10, rotateY: 15 },
    right: { x: -10, rotateY: -15 }
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setTimeout(() => setIsOpen(false), 100)}
      >
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.9,
              ...animations[position]
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              x: 0,
              rotateX: 0,
              rotateY: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9,
              ...animations[position]
            }}
            transition={{ type: 'spring', damping: 25 }}
            style={{ perspective: 1000 }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className={cn(
              'absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4',
              positions[position]
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}