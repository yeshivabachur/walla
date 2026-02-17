import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TimelineScrubber({ 
  events = [],
  currentIndex = 0,
  onIndexChange,
  autoPlay = false,
  interval = 3000,
  className 
}) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  React.useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % events.length;
      setActiveIndex(nextIndex);
      onIndexChange?.(nextIndex);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, activeIndex, events.length, interval, onIndexChange]);

  const handleSeek = (index) => {
    setActiveIndex(index);
    onIndexChange?.(index);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Progress bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
          animate={{ width: `${((activeIndex + 1) / events.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />

        {/* Event markers */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          {events.map((event, index) => (
            <button
              key={index}
              onClick={() => handleSeek(index)}
              className="relative group"
            >
              <motion.div
                className={cn(
                  'w-3 h-3 rounded-full border-2 border-white transition-colors',
                  index <= activeIndex
                    ? 'bg-indigo-600'
                    : 'bg-gray-300'
                )}
                whileHover={{ scale: 1.5 }}
              />

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {event.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </motion.button>

        <div className="text-sm text-gray-600 font-medium">
          {events[activeIndex]?.label || `Step ${activeIndex + 1} of ${events.length}`}
        </div>
      </div>
    </div>
  );
}