import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function PulseLoader({ 
  size = 'md',
  color = 'indigo',
  className 
}) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colors = {
    indigo: 'bg-indigo-600',
    green: 'bg-emerald-500',
    pink: 'bg-pink-500',
    blue: 'bg-blue-500'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn('rounded-full', sizes[size], colors[color])}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}