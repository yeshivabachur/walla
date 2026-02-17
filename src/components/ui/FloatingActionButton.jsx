import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FloatingActionButton({ actions = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20, scale: 0 }}
            animate={{ 
              opacity: 1, 
              y: -(60 * (index + 1)), 
              scale: 1 
            }}
            exit={{ opacity: 0, y: 20, scale: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: index * 0.05
            }}
            onClick={action.onClick}
            className={cn(
              'absolute bottom-0 right-0',
              'w-14 h-14 rounded-full',
              'bg-white shadow-lg hover:shadow-xl',
              'flex items-center justify-center',
              'transition-all duration-300',
              'group'
            )}
          >
            <action.icon className="w-5 h-5 text-indigo-600" />
            <span className="absolute right-16 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {action.label}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-16 h-16 rounded-full',
          'bg-gradient-to-r from-indigo-600 to-purple-600',
          'shadow-2xl hover:shadow-indigo-500/50',
          'flex items-center justify-center',
          'transition-all duration-300',
          isOpen && 'rotate-45'
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </div>
  );
}