import React from 'react';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';

export default function LiveIndicator({ 
  label = 'LIVE',
  size = 'md',
  className = ''
}) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring' }}
      className={`inline-flex items-center gap-2 bg-red-500 text-white rounded-full font-bold ${sizes[size]} ${className}`}
    >
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.7, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Radio className="w-3 h-3 fill-white" />
      </motion.div>
      {label}
    </motion.div>
  );
}