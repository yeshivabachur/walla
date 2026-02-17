import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function MorphButton({ 
  children,
  loadingText = 'Loading...',
  successText = 'Success!',
  onClick,
  className 
}) {
  const [state, setState] = useState('idle'); // idle, loading, success

  const handleClick = async () => {
    setState('loading');
    try {
      await onClick?.();
      setState('success');
      setTimeout(() => setState('idle'), 2000);
    } catch (error) {
      setState('idle');
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={state !== 'idle'}
      className={cn(
        'relative px-6 py-3 rounded-xl font-semibold overflow-hidden',
        state === 'idle' && 'bg-indigo-600 hover:bg-indigo-700 text-white',
        state === 'loading' && 'bg-gray-400 text-white cursor-wait',
        state === 'success' && 'bg-emerald-500 text-white',
        'transition-colors duration-300',
        className
      )}
      animate={{
        scale: state === 'success' ? [1, 1.05, 1] : 1
      }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={state}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center gap-2"
        >
          {state === 'idle' && children}
          {state === 'loading' && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              {loadingText}
            </>
          )}
          {state === 'success' && (
            <>
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.path
                  d="M2 8l4 4 8-8"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
              {successText}
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}