import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, X, TrendingDown, Car, Gift, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const notificationIcons = {
  ride_reminder: Car,
  surge_drop: TrendingDown,
  reward_available: Gift,
  achievement: Trophy,
  promo: Gift,
  driver_nearby: Car
};

export default function SmartNotificationCenter({ userEmail }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', userEmail],
    queryFn: () => base44.entities.SmartNotification.filter({ user_email: userEmail }, '-created_date', 20),
    enabled: !!userEmail,
    refetchInterval: 30000
  });

  const markReadMutation = useMutation({
    mutationFn: async (notificationId) => {
      await base44.entities.SmartNotification.update(notificationId, { read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification) => {
    markReadMutation.mutate(notification.id);
    if (notification.action_url) {
      navigate(notification.action_url);
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">{unreadCount} new</Badge>
            )}
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <BellOff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No notifications</p>
              </div>
            ) : (
              notifications.map((notification, index) => {
                const Icon = notificationIcons[notification.type] || Bell;
                return (
                  <motion.button
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-4 border-b hover:bg-gray-50 text-left transition-colors ${
                      !notification.read && 'bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        notification.priority === 'urgent' ? 'bg-red-100' : 'bg-indigo-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          notification.priority === 'urgent' ? 'text-red-600' : 'text-indigo-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.created_date).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-2" />
                      )}
                    </div>
                  </motion.button>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  );
}