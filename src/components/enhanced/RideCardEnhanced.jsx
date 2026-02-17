import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Clock, Users, DollarSign, Star } from 'lucide-react';
import ThreeDCard from '@/components/ui/3DCard';
import AnimatedBadge from '@/components/ui/AnimatedBadge';
import { CardContent } from '@/components/ui/card';

export default function RideCardEnhanced({ 
  ride,
  onAction,
  actionLabel = 'View',
  showDriver = true
}) {
  return (
    <ThreeDCard className="h-full">
      <CardContent className="p-6">
        {/* Route */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-indigo-600 rounded-full"
            />
            <span className="font-semibold text-gray-900">{ride.pickup_location}</span>
          </div>

          <div className="ml-1 border-l-2 border-dashed border-gray-300 h-8" />

          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="w-2 h-2 bg-emerald-600 rounded-full"
            />
            <span className="font-semibold text-gray-900">{ride.dropoff_location}</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{ride.passengers}</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{ride.pickup_time || 'Now'}</span>
          </div>
          
          <motion.div 
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-emerald-600">${ride.estimated_price}</span>
          </motion.div>
        </div>

        {/* Driver info */}
        {showDriver && ride.driver_name && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {ride.driver_name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{ride.driver_name}</p>
              <p className="text-xs text-gray-500">{ride.vehicle_info}</p>
            </div>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </motion.div>
        )}

        {/* Status badge */}
        <div className="flex items-center justify-between">
          <AnimatedBadge
            bounce={ride.status === 'in_progress'}
            className={
              ride.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              ride.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
              ride.status === 'in_progress' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }
          >
            {ride.status}
          </AnimatedBadge>

          {onAction && (
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAction(ride)}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              {actionLabel}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </CardContent>
    </ThreeDCard>
  );
}