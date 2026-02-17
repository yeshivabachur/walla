import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ToggleSwitch({ 
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className 
}) {
  const sizes = {
    sm: { container: 'w-8 h-5', thumb: 'w-3 h-3' },
    md: { container: 'w-11 h-6', thumb: 'w-4 h-4' },
    lg: { container: 'w-14 h-7', thumb: 'w-5 h-5' }
  };

  return (
    <label className={cn('flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed', className)}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      
      <motion.div
        className={cn(
          'relative rounded-full transition-colors duration-300',
          sizes[size].container,
          checked ? 'bg-indigo-600' : 'bg-gray-300'
        )}
        onClick={() => !disabled && onChange?.(!checked)}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        <motion.div
          className={cn(
            'absolute top-1 left-1 bg-white rounded-full shadow-md',
            sizes[size].thumb
          )}
          animate={{
            x: checked ? (sizes[size].container === 'w-8 h-5' ? 12 : sizes[size].container === 'w-11 h-6' ? 20 : 28) : 0
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </label>
  );
}