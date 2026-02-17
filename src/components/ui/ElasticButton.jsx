import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './button';

export default function ElasticButton({ children, className, ...props }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17
      }}
    >
      <Button
        className={cn(
          'shadow-lg hover:shadow-xl transition-shadow duration-300',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}