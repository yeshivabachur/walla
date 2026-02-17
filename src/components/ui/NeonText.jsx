import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function NeonText({ 
  children, 
  color = 'indigo',
  flicker = false,
  className 
}) {
  const colors = {
    indigo: 'text-indigo-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    blue: 'text-blue-400',
    green: 'text-emerald-400'
  };

  const glows = {
    indigo: '0 0 7px rgba(99, 102, 241, 0.9), 0 0 10px rgba(99, 102, 241, 0.7), 0 0 21px rgba(99, 102, 241, 0.5)',
    purple: '0 0 7px rgba(168, 85, 247, 0.9), 0 0 10px rgba(168, 85, 247, 0.7), 0 0 21px rgba(168, 85, 247, 0.5)',
    pink: '0 0 7px rgba(236, 72, 153, 0.9), 0 0 10px rgba(236, 72, 153, 0.7), 0 0 21px rgba(236, 72, 153, 0.5)',
    blue: '0 0 7px rgba(59, 130, 246, 0.9), 0 0 10px rgba(59, 130, 246, 0.7), 0 0 21px rgba(59, 130, 246, 0.5)',
    green: '0 0 7px rgba(52, 211, 153, 0.9), 0 0 10px rgba(52, 211, 153, 0.7), 0 0 21px rgba(52, 211, 153, 0.5)'
  };

  return (
    <motion.span
      className={cn(colors[color], 'font-bold', className)}
      style={{ textShadow: glows[color] }}
      animate={flicker ? {
        opacity: [1, 0.8, 1, 0.9, 1],
      } : {}}
      transition={flicker ? {
        duration: 0.1,
        repeat: Infinity,
        repeatDelay: Math.random() * 5
      } : {}}
    >
      {children}
    </motion.span>
  );
}