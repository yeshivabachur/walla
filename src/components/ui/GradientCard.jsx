import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from './card';

export default function GradientCard({ 
  children, 
  className,
  gradient = 'primary',
  animated = true,
  ...props 
}) {
  const gradients = {
    primary: 'from-indigo-500 to-purple-600',
    success: 'from-emerald-400 to-teal-500',
    warm: 'from-orange-400 to-pink-500',
    cool: 'from-blue-400 to-cyan-500',
    sunset: 'from-orange-500 via-pink-500 to-purple-600',
    ocean: 'from-blue-500 via-teal-500 to-emerald-500'
  };

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20 } : false}
      animate={animated ? { opacity: 1, y: 0 } : false}
      whileHover={animated ? { scale: 1.02, y: -4 } : false}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          'relative overflow-hidden',
          'bg-gradient-to-br',
          gradients[gradient],
          'text-white shadow-xl hover:shadow-2xl',
          'transition-shadow duration-300',
          className
        )}
        {...props}
      >
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </Card>
    </motion.div>
  );
}