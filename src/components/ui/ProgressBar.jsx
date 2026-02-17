import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ProgressBar({ 
  value = 0,
  showLabel = true,
  color = 'indigo',
  height = 'md',
  animated = true,
  className 
}) {
  const colors = {
    indigo: 'from-indigo-600 to-purple-600',
    green: 'from-emerald-500 to-teal-500',
    blue: 'from-blue-500 to-cyan-500',
    pink: 'from-pink-500 to-rose-500'
  };

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4'
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span className="font-semibold">{Math.round(value)}%</span>
        </div>
      )}
      
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', heights[height])}>
        <motion.div
          className={cn('h-full bg-gradient-to-r rounded-full', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
        >
          {animated && (
            <motion.div
              className="h-full w-full bg-white/30"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}