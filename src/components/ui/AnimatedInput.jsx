import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from './input';
import { cn } from '@/lib/utils';

export default function AnimatedInput({ 
  label,
  error,
  success,
  icon: Icon,
  className,
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon className="w-5 h-5" />
            </div>
          )}
          
          <Input
            {...props}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              Icon && 'pl-10',
              error && 'border-red-500 focus-visible:ring-red-500',
              success && 'border-green-500 focus-visible:ring-green-500',
              'transition-all duration-200',
              className
            )}
          />
          
          {label && (
            <motion.label
              className={cn(
                'absolute left-3 pointer-events-none transition-all duration-200',
                Icon && 'left-10',
                isFocused || props.value
                  ? '-top-2 text-xs bg-white px-1'
                  : 'top-1/2 -translate-y-1/2 text-sm',
                error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'
              )}
            >
              {label}
            </motion.label>
          )}
        </div>
      </motion.div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600 mt-1 ml-1"
        >
          {error}
        </motion.p>
      )}
      
      {success && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-green-600 mt-1 ml-1"
        >
          {success}
        </motion.p>
      )}
    </div>
  );
}