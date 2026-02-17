import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CheckboxGroupAnimated({ 
  options,
  selected = [],
  onChange,
  className 
}) {
  const handleToggle = (value) => {
    const newSelected = selected.includes(value)
      ? selected.filter(v => v !== value)
      : [...selected, value];
    onChange?.(newSelected);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {options.map((option, index) => {
        const isChecked = selected.includes(option.value);

        return (
          <motion.label
            key={option.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4 }}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all',
              isChecked
                ? 'bg-indigo-50 border border-indigo-200'
                : 'hover:bg-gray-50'
            )}
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(option.value)}
                className="sr-only"
              />
              
              <div className={cn(
                'w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center',
                isChecked
                  ? 'border-indigo-600 bg-indigo-600'
                  : 'border-gray-300 bg-white'
              )}>
                <AnimatePresence>
                  {isChecked && (
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                {option.icon && <option.icon className="w-4 h-4 text-gray-600" />}
                <span className="font-medium text-gray-900">{option.label}</span>
              </div>
              {option.description && (
                <p className="text-sm text-gray-600 mt-0.5">{option.description}</p>
              )}
            </div>
          </motion.label>
        );
      })}
    </div>
  );
}