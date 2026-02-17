import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function PulsatingDot({ 
  color = 'green',
  size = 'md',
  className 
}) {
  const colors = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    indigo: 'bg-indigo-500'
  };

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className={cn('relative inline-flex', className)}>
      <motion.span
        className={cn('rounded-full', sizes[size], colors[color])}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      <motion.span
        className={cn(
          'absolute inset-0 rounded-full',
          colors[color],
          'opacity-75'
        )}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  );
}