import React from 'react';
import { motion } from 'framer-motion';

export default function MorphingIcon({ 
  IconA, 
  IconB, 
  isToggled,
  size = 24,
  className = ''
}) {
  return (
    <div className={`relative w-${size} h-${size} ${className}`}>
      <motion.div
        initial={false}
        animate={{
          opacity: isToggled ? 0 : 1,
          rotate: isToggled ? 90 : 0,
          scale: isToggled ? 0.5 : 1
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0"
      >
        <IconA size={size} />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          opacity: isToggled ? 1 : 0,
          rotate: isToggled ? 0 : -90,
          scale: isToggled ? 1 : 0.5
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0"
      >
        <IconB size={size} />
      </motion.div>
    </div>
  );
}