import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ColorPicker({ 
  colors = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#fa709a', '#fee140', '#30cfd0', '#330867',
    '#a8edea', '#fed6e3', '#ff6b6b', '#4ecdc4'
  ],
  selected,
  onChange,
  className 
}) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {colors.map((color) => {
        const isSelected = selected === color;
        
        return (
          <motion.button
            key={color}
            onClick={() => onChange?.(color)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'w-10 h-10 rounded-full relative',
              'transition-all duration-200',
              isSelected && 'ring-2 ring-offset-2 ring-gray-400'
            )}
            style={{ backgroundColor: color }}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check className="w-5 h-5 text-white drop-shadow-lg" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}