import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function WaveLoader({ 
  size = 'md',
  color = 'indigo',
  className 
}) {
  const sizes = {
    sm: 'w-1 h-6',
    md: 'w-1.5 h-10',
    lg: 'w-2 h-14'
  };

  const colors = {
    indigo: 'bg-indigo-600',
    green: 'bg-emerald-500',
    blue: 'bg-blue-500',
    pink: 'bg-pink-500'
  };

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={cn('rounded-full', sizes[size], colors[color])}
          animate={{
            scaleY: [1, 1.5, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}