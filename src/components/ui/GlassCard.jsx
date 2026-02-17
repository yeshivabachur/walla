import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function GlassCard({ 
  children, 
  className, 
  hover = true,
  blur = 'md',
  ...props 
}) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white/70 border border-white/20 rounded-2xl shadow-xl',
        blurClasses[blur],
        hover && 'hover:-translate-y-1 hover:shadow-2xl transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}