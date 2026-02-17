import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      setTimeout(() => setWasOffline(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {(!isOnline || wasOffline) && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]"
        >
          <div className={cn(
            'flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md',
            isOnline
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-900 text-white'
          )}>
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5" />
                <span className="font-medium">Back online!</span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <WifiOff className="w-5 h-5" />
                </motion.div>
                <span className="font-medium">No internet connection</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}