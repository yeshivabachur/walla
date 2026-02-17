import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CarouselAdvanced({ 
  items,
  autoPlay = false,
  interval = 5000,
  className 
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  React.useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      next();
    }, interval);

    return () => clearInterval(timer);
  }, [current, autoPlay, interval]);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className={cn('relative overflow-hidden rounded-2xl', className)}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="w-full"
        >
          {items[current]}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900" />
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
      >
        <ChevronRight className="w-5 h-5 text-gray-900" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === current
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            )}
          />
        ))}
      </div>
    </div>
  );
}