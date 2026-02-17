import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function GradientText({ 
  children, 
  gradient = 'primary',
  animated = false,
  className 
}) {
  const gradients = {
    primary: 'from-indigo-600 via-purple-600 to-pink-600',
    success: 'from-emerald-500 via-teal-500 to-cyan-500',
    warm: 'from-orange-500 via-pink-500 to-red-500',
    cool: 'from-blue-500 via-indigo-500 to-purple-500',
    sunset: 'from-orange-400 via-pink-500 to-purple-600',
    rainbow: 'from-red-500 via-yellow-500 to-green-500'
  };

  return (
    <motion.span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        gradients[gradient],
        animated && 'bg-[length:200%_auto] animate-gradient',
        className
      )}
      style={animated ? {
        backgroundSize: '200% auto',
        animation: 'gradient 3s linear infinite'
      } : {}}
    >
      {children}
    </motion.span>
  );
}