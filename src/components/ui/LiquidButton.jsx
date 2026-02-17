import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function LiquidButton({ 
  children, 
  onClick,
  className,
  color = 'indigo',
  ...props 
}) {
  const colors = {
    indigo: 'from-indigo-600 to-purple-600',
    green: 'from-emerald-500 to-teal-500',
    pink: 'from-pink-500 to-rose-500',
    blue: 'from-blue-500 to-cyan-500'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative px-8 py-4 rounded-full font-semibold text-white',
        'overflow-hidden group',
        className
      )}
      {...props}
    >
      {/* Animated liquid background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-r',
        colors[color],
        'transition-all duration-500 group-hover:scale-110'
      )} />
      
      {/* Liquid blob */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        initial={false}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
      </motion.div>
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}