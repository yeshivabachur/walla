import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Modal3D({ 
  isOpen,
  onClose,
  children,
  title,
  className 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.5, 
                rotateX: -90,
                y: -100
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotateX: 0,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.5, 
                rotateX: 90,
                y: 100
              }}
              transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 25
              }}
              style={{ perspective: 1000 }}
              className={cn(
                'bg-white rounded-3xl shadow-2xl w-full max-w-2xl pointer-events-auto relative',
                'max-h-[90vh] overflow-hidden',
                className
              )}
            >
              {/* Header */}
              {title && (
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              )}

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}