import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function NeuButton({ 
  children, 
  onClick,
  className,
  variant = 'raised',
  ...props 
}) {
  const variants = {
    raised: 'shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_rgba(255,255,255,0.9)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.9)]',
    pressed: 'shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.9)]'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'px-6 py-3 rounded-2xl bg-[#f0f0f3] font-medium',
        'transition-all duration-200',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}