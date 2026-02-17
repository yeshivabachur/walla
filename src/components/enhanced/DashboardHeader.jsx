import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings, Search, HelpCircle } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import NotificationCenterEnhanced from './NotificationCenterEnhanced';
import { Button } from '@/components/ui/button';

export default function DashboardHeader({ 
  title,
  subtitle,
  user,
  onSearch,
  className = ''
}) {
  return (
    <div className={`glass-strong rounded-2xl p-6 mb-8 ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          {onSearch && (
            <SearchBar
              onSearch={onSearch}
              className="w-64"
              popularSearches={['My Rides', 'Earnings', 'Settings']}
            />
          )}

          <NotificationCenterEnhanced 
            notifications={[
              { id: 1, type: 'success', title: 'Ride completed', message: 'Your ride to Downtown was completed', time: '2m ago', read: false },
              { id: 2, type: 'promo', title: '20% off', message: 'Special discount on your next ride', time: '1h ago', read: false }
            ]}
          />

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/80 rounded-xl transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </motion.button>

          {user && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 bg-white/80 px-4 py-2 rounded-xl shadow-sm cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}