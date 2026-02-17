import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChipSelector({ 
  options,
  selected = [],
  onChange,
  multiSelect = true,
  className 
}) {
  const handleToggle = (option) => {
    if (multiSelect) {
      const newSelected = selected.includes(option)
        ? selected.filter(item => item !== option)
        : [...selected, option];
      onChange?.(newSelected);
    } else {
      onChange?.([option]);
    }
  };

  const isSelected = (option) => selected.includes(option);

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option, index) => {
        const selected = isSelected(option);
        
        return (
          <motion.button
            key={option}
            onClick={() => handleToggle(option)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-4 py-2 rounded-full font-medium transition-all duration-200',
              'border-2',
              selected
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
            )}
          >
            <span className="flex items-center gap-2">
              {option}
              {selected && (
                <motion.div
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <X className="w-3 h-3" />
                </motion.div>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}