import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PriceSlider({ 
  min = 0,
  max = 100,
  value = [0, 100],
  onChange,
  className 
}) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (newValue, index) => {
    const updated = [...localValue];
    updated[index] = newValue;
    if (index === 0 && newValue > updated[1]) return;
    if (index === 1 && newValue < updated[0]) return;
    setLocalValue(updated);
    onChange?.(updated);
  };

  const getPosition = (val) => ((val - min) / (max - min)) * 100;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Price Range</span>
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
          <DollarSign className="w-4 h-4" />
          {localValue[0]} - ${localValue[1]}
        </div>
      </div>

      <div className="relative h-2 bg-gray-200 rounded-full">
        {/* Selected range */}
        <motion.div
          className="absolute h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
          animate={{
            left: `${getPosition(localValue[0])}%`,
            width: `${getPosition(localValue[1]) - getPosition(localValue[0])}%`
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[0]}
          onChange={(e) => handleChange(Number(e.target.value), 0)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />

        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={(e) => handleChange(Number(e.target.value), 1)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />

        {/* Visual thumbs */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-indigo-600 rounded-full shadow-lg pointer-events-none"
          animate={{ left: `calc(${getPosition(localValue[0])}% - 10px)` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-indigo-600 rounded-full shadow-lg pointer-events-none"
          animate={{ left: `calc(${getPosition(localValue[1])}% - 10px)` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}