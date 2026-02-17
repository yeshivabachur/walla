import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Card } from './card';
import { cn } from '@/lib/utils';

export default function SwipeCard({ 
  children,
  onSwipeLeft,
  onSwipeRight,
  className 
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      onSwipeRight?.();
    } else if (info.offset.x < -100) {
      onSwipeLeft?.();
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={cn('cursor-grab active:cursor-grabbing', className)}
    >
      <Card className="shadow-2xl">
        {children}
      </Card>
    </motion.div>
  );
}