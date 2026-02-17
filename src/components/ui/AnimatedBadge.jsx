import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

export default function AnimatedBadge({ 
  children, 
  className,
  pulse = false,
  bounce = false,
  ...props 
}) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ 
        scale: 1,
        ...(pulse && {
          boxShadow: [
            '0 0 0 0 rgba(102, 126, 234, 0.7)',
            '0 0 0 10px rgba(102, 126, 234, 0)',
          ]
        }),
        ...(bounce && {
          y: [0, -5, 0]
        })
      }}
      transition={{
        scale: { duration: 0.3, type: 'spring' },
        ...(pulse && {
          boxShadow: { duration: 1.5, repeat: Infinity }
        }),
        ...(bounce && {
          y: { duration: 1, repeat: Infinity }
        })
      }}
    >
      <Badge className={cn('shadow-sm', className)} {...props}>
        {children}
      </Badge>
    </motion.div>
  );
}