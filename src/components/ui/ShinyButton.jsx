import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './button';

export default function ShinyButton({ 
  children, 
  className,
  ...props 
}) {
  return (
    <Button
      className={cn(
        'relative overflow-hidden group',
        'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600',
        'bg-[length:200%_100%]',
        'hover:bg-[position:100%_0]',
        'transition-all duration-500',
        'shadow-lg hover:shadow-xl',
        className
      )}
      {...props}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-100%', skewX: -20 }}
        animate={{ x: '200%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut'
        }}
      />
      
      {/* Content */}
      <span className="relative z-10 text-white font-semibold">
        {children}
      </span>
    </Button>
  );
}