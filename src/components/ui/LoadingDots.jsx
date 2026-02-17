import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function LoadingDots({ 
  size = 'md',
  color = 'indigo',
  className 
}) {
  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-4 h-4'
  };

  const colors = {
    indigo: 'bg-indigo-600',
    green: 'bg-emerald-500',
    blue: 'bg-blue-500',
    pink: 'bg-pink-500',
    white: 'bg-white'
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn('rounded-full', sizes[size], colors[color])}
          animate={{
            y: ['0%', '-50%', '0%'],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}