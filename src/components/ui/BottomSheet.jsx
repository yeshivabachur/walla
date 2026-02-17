import React from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function BottomSheet({ 
  isOpen,
  onClose,
  children,
  snapPoints = [0.5, 0.9],
  className 
}) {
  const dragControls = useDragControls();

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: `${(1 - snapPoints[0]) * 100}%` }}
            exit={{ y: '100%' }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            dragControls={dragControls}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100) {
                onClose();
              }
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed inset-x-0 bottom-0 z-50',
              'bg-white rounded-t-3xl shadow-2xl',
              'max-h-[90vh] overflow-hidden',
              className
            )}
          >
            {/* Handle */}
            <div 
              className="w-full py-4 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 pb-6 max-h-[calc(90vh-60px)]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}