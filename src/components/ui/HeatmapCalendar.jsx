import React from 'react';
import { motion } from 'framer-motion';
import { startOfYear, eachDayOfInterval, endOfYear, format, getDay } from 'date-fns';
import { cn } from '@/lib/utils';

export default function HeatmapCalendar({ 
  data = {},
  year = new Date().getFullYear(),
  className 
}) {
  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(new Date(year, 11, 31));
  const days = eachDayOfInterval({ start: yearStart, end: yearEnd });

  const getIntensity = (day) => {
    const key = format(day, 'yyyy-MM-dd');
    const value = data[key] || 0;
    if (value === 0) return 'bg-gray-100';
    if (value <= 2) return 'bg-emerald-200';
    if (value <= 4) return 'bg-emerald-400';
    if (value <= 6) return 'bg-emerald-600';
    return 'bg-emerald-800';
  };

  const weeks = [];
  let week = Array(7).fill(null);
  
  days.forEach((day, index) => {
    const dayOfWeek = getDay(day);
    week[dayOfWeek] = day;
    
    if (dayOfWeek === 6 || index === days.length - 1) {
      weeks.push([...week]);
      week = Array(7).fill(null);
    }
  });

  return (
    <div className={cn('glass-strong rounded-2xl p-6', className)}>
      <h3 className="font-bold text-gray-900 mb-4">Activity Heatmap - {year}</h3>
      
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                if (!day) return <div key={dayIndex} className="w-3 h-3" />;
                
                const intensity = getIntensity(day);
                const value = data[format(day, 'yyyy-MM-dd')] || 0;

                return (
                  <motion.div
                    key={format(day, 'yyyy-MM-dd')}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                    whileHover={{ scale: 1.5, zIndex: 10 }}
                    className={cn(
                      'w-3 h-3 rounded-sm cursor-pointer',
                      intensity
                    )}
                    title={`${format(day, 'MMM d, yyyy')}: ${value} rides`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
        <span>Less</span>
        <div className="flex gap-1">
          {['bg-gray-100', 'bg-emerald-200', 'bg-emerald-400', 'bg-emerald-600', 'bg-emerald-800'].map((color, i) => (
            <div key={i} className={cn('w-3 h-3 rounded-sm', color)} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}