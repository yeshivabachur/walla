import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ActivityFeed({ 
  activities = [],
  className 
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id || index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ x: 4 }}
          className="flex items-start gap-4 p-4 bg-white hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
        >
          {/* Icon */}
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            activity.type === 'success' && 'bg-emerald-100',
            activity.type === 'info' && 'bg-blue-100',
            activity.type === 'warning' && 'bg-yellow-100',
            !activity.type && 'bg-indigo-100'
          )}>
            {activity.icon && (
              <activity.icon className={cn(
                'w-5 h-5',
                activity.type === 'success' && 'text-emerald-600',
                activity.type === 'info' && 'text-blue-600',
                activity.type === 'warning' && 'text-yellow-600',
                !activity.type && 'text-indigo-600'
              )} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {activity.title}
            </p>
            
            {activity.description && (
              <p className="text-sm text-gray-600 mb-2">
                {activity.description}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-gray-500">
              {activity.timestamp && (
                <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
              )}
              
              {activity.user && (
                <>
                  <span>•</span>
                  <span>{activity.user}</span>
                </>
              )}

              {activity.badge && (
                <>
                  <span>•</span>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                    {activity.badge}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Indicator dot */}
          {!activity.read && (
            <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-2" />
          )}
        </motion.div>
      ))}
    </div>
  );
}