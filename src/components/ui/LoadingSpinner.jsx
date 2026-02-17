import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-3"
    >
      <Loader2 className={`${sizes[size]} animate-spin text-indigo-600`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </motion.div>
  );
}