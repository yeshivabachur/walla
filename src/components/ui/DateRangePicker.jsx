import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function DateRangePicker({ 
  value,
  onChange,
  className 
}) {
  const [range, setRange] = useState(value || { from: null, to: null });

  const handleSelect = (newRange) => {
    setRange(newRange);
    onChange?.(newRange);
  };

  const clearRange = () => {
    setRange({ from: null, to: null });
    onChange?.({ from: null, to: null });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal h-12 rounded-xl',
            !range?.from && 'text-gray-500',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {range?.from ? (
            range?.to ? (
              <>
                {format(range.from, 'MMM d, yyyy')} - {format(range.to, 'MMM d, yyyy')}
              </>
            ) : (
              format(range.from, 'MMM d, yyyy')
            )
          ) : (
            'Select date range'
          )}
          
          {range?.from && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              onClick={(e) => {
                e.stopPropagation();
                clearRange();
              }}
              className="ml-auto hover:bg-gray-200 rounded-full p-1"
            >
              <X className="w-3 h-3" />
            </motion.button>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}