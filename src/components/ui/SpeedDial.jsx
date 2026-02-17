import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SpeedDial({ actions = [], position = 'bottom-right' }) {
  const [isOpen, setIsOpen] = useState(false);

  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <div className={cn('fixed z-50', positions[position])}>
      <AnimatePresence>
        {isOpen && actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: position.startsWith('bottom') ? -(64 * (index + 1)) : (64 * (index + 1))
            }}
            exit={{ opacity: 0, scale: 0, y: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: index * 0.05
            }}
            className="absolute bottom-0 right-0"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center group relative"
            >
              <action.icon className="w-6 h-6 text-indigo-600" />
              
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-16 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              >
                {action.label}
              </motion.span>
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-16 h-16 rounded-full shadow-2xl',
          'bg-gradient-to-br from-indigo-600 to-purple-600',
          'flex items-center justify-center',
          'transition-all duration-300',
          isOpen && 'rotate-45'
        )}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <Plus className="w-7 h-7 text-white" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}