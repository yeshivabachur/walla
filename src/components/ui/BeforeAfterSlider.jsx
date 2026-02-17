import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function BeforeAfterSlider({ 
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className 
}) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div 
      className={cn('relative overflow-hidden rounded-2xl select-none', className)}
      onMouseMove={handleMove}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        handleMove({ currentTarget: e.currentTarget, clientX: touch.clientX });
      }}
    >
      {/* After image (full) */}
      <img src={afterImage} alt={afterLabel} className="w-full h-full object-cover" />

      {/* Before image (clipped) */}
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={beforeImage} alt={beforeLabel} className="w-full h-full object-cover" />
      </motion.div>

      {/* Slider handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-gray-400" />
            <div className="w-0.5 h-4 bg-gray-400" />
          </div>
        </div>
      </motion.div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">
        {beforeLabel}
      </div>
      
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">
        {afterLabel}
      </div>
    </div>
  );
}