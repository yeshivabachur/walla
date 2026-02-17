import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function NotificationBadge({ 
  count = 0,
  max = 99,
  children,
  position = 'top-right',
  className 
}) {
  if (count === 0) return <>{children}</>;

  const positions = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1'
  };

  const displayCount = count > max ? `${max}+` : count;

  return (
    <div className={cn('relative inline-block', className)}>
      {children}
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn(
          'absolute min-w-[20px] h-5 px-1.5 flex items-center justify-center',
          'bg-red-500 text-white text-xs font-bold rounded-full',
          'shadow-lg',
          positions[position]
        )}
      >
        <motion.span
          key={displayCount}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {displayCount}
        </motion.span>
      </motion.div>
    </div>
  );
}