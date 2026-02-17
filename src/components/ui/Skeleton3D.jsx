import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Skeleton3DCard({ className }) {
  return (
    <div className={cn('glass rounded-2xl p-6 space-y-4', className)}>
      <div className="flex items-center gap-4">
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="w-16 h-16 bg-gray-200 rounded-full"
        />
        
        <div className="flex-1 space-y-2">
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.2,
              ease: 'easeInOut'
            }}
            className="h-4 bg-gray-200 rounded-lg w-3/4"
          />
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.4,
              ease: 'easeInOut'
            }}
            className="h-3 bg-gray-200 rounded-lg w-1/2"
          />
        </div>
      </div>

      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut'
            }}
            className="h-4 bg-gray-200 rounded-lg"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function Skeleton3DList({ count = 3, className }) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton3DCard key={i} />
      ))}
    </div>
  );
}