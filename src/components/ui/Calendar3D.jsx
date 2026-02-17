import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Calendar3D({ 
  selected,
  onChange,
  className 
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className={cn('glass-strong rounded-2xl p-6 shadow-xl', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <h3 className="text-lg font-bold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day, index) => {
          const isSelected = selected && isSameDay(day, selected);
          const isCurrentDay = isToday(day);

          return (
            <motion.button
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange?.(day)}
              className={cn(
                'aspect-square rounded-lg text-sm font-medium transition-all relative',
                isSelected
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg'
                  : isCurrentDay
                  ? 'bg-indigo-50 text-indigo-600 border-2 border-indigo-300'
                  : 'hover:bg-gray-100 text-gray-700'
              )}
            >
              {format(day, 'd')}
              
              {isSelected && (
                <motion.div
                  layoutId="selectedDay"
                  className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2 }}
                />
              )}
              
              <span className="relative z-10">{format(day, 'd')}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}