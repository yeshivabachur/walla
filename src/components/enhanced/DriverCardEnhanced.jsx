import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, TrendingUp, Shield } from 'lucide-react';
import SpotlightCard from '@/components/ui/SpotlightCard';
import AnimatedBadge from '@/components/ui/AnimatedBadge';
import StarRating from '@/components/ui/StarRating';

export default function DriverCardEnhanced({ 
  driver,
  showStats = true
}) {
  return (
    <SpotlightCard>
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {driver.name?.charAt(0) || 'D'}
            </div>
            
            {driver.verified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white"
              >
                <Shield className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </motion.div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1">{driver.name}</h3>
            
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={driver.rating || 4.8} readonly size="sm" />
            </div>

            <div className="flex items-center gap-2">
              {driver.isPro && (
                <AnimatedBadge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                  <Award className="w-3 h-3 mr-1" />
                  Pro Driver
                </AnimatedBadge>
              )}
              
              {driver.topRated && (
                <AnimatedBadge pulse className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                  <Star className="w-3 h-3 mr-1" />
                  Top Rated
                </AnimatedBadge>
              )}
            </div>
          </div>
        </div>

        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{driver.totalRides || 1234}</div>
              <div className="text-xs text-gray-500">Rides</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{driver.acceptanceRate || 95}%</div>
              <div className="text-xs text-gray-500">Acceptance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{driver.yearsActive || 3}y</div>
              <div className="text-xs text-gray-500">Experience</div>
            </div>
          </motion.div>
        )}

        {driver.vehicle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{driver.vehicle.make} {driver.vehicle.model}</span>
              {' • '}
              <span>{driver.vehicle.color}</span>
              {' • '}
              <span>{driver.vehicle.plate}</span>
            </p>
          </motion.div>
        )}
      </div>
    </SpotlightCard>
  );
}