import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Info, AlertCircle, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationBadge from '@/components/ui/NotificationBadge';
import GlassCard from '@/components/ui/GlassCard';

export default function NotificationCenterEnhanced({ notifications = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(notifications);

  const unreadCount = items.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return Check;
      case 'error': return AlertCircle;
      case 'promo': return Gift;
      default: return Info;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'error': return 'bg-red-50 text-red-700 border-red-200';
      case 'promo': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const markAsRead = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, read: true } : item
    ));
  };

  const removeNotification = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="relative">
      <NotificationBadge count={unreadCount}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-600" />
        </motion.button>
      </NotificationBadge>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-12 w-96 max-h-[600px] z-50"
            >
              <GlassCard blur="lg" className="overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {/* List */}
                <div className="max-h-[500px] overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <div className="p-2 space-y-2">
                      <AnimatePresence>
                        {items.map((notification, index) => {
                          const Icon = getIcon(notification.type);
                          
                          return (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => markAsRead(notification.id)}
                              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                notification.read 
                                  ? 'bg-white border-gray-100' 
                                  : getColor(notification.type)
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  notification.type === 'success' ? 'bg-emerald-100' :
                                  notification.type === 'error' ? 'bg-red-100' :
                                  notification.type === 'promo' ? 'bg-purple-100' :
                                  'bg-blue-100'
                                }`}>
                                  <Icon className="w-4 h-4" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm mb-1">{notification.title}</p>
                                  <p className="text-xs opacity-80 line-clamp-2">{notification.message}</p>
                                  <p className="text-xs opacity-60 mt-1">{notification.time}</p>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}