import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SegmentedControl({ 
  options,
  defaultValue,
  onChange,
  className 
}) {
  const [selected, setSelected] = useState(defaultValue || options[0].value);

  const handleSelect = (value) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className={cn('inline-flex bg-gray-100 p-1 rounded-xl', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSelect(option.value)}
          className={cn(
            'relative px-6 py-2 rounded-lg font-medium transition-colors z-10',
            selected === option.value
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {selected === option.value && (
            <motion.div
              layoutId="segmentedControlBg"
              className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          
          <span className="relative z-10 flex items-center gap-2">
            {option.icon && <option.icon className="w-4 h-4" />}
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}