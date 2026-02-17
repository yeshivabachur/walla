import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from './card';

export default function GlowingCard({ 
  children, 
  className,
  glowColor = 'indigo',
  intensity = 'medium',
  ...props 
}) {
  const glowColors = {
    indigo: 'shadow-indigo-500/50',
    purple: 'shadow-purple-500/50',
    pink: 'shadow-pink-500/50',
    blue: 'shadow-blue-500/50',
    green: 'shadow-emerald-500/50'
  };

  const intensities = {
    low: 'shadow-lg hover:shadow-xl',
    medium: 'shadow-xl hover:shadow-2xl',
    high: 'shadow-2xl hover:shadow-[0_0_60px_-15px]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          'border-0 transition-all duration-300',
          intensities[intensity],
          glowColors[glowColor],
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
}