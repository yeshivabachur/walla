import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import GlowingCard from '@/components/ui/GlowingCard';
import CountUp from '@/components/ui/CountUp';
import SparklineChart from '@/components/ui/SparklineChart';

export default function QuickStats({ stats, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => {
        const changeType = stat.change > 0 ? 'up' : stat.change < 0 ? 'down' : 'neutral';
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlowingCard 
              glowColor={stat.color || 'indigo'}
              intensity="medium"
              className="p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">{stat.label}</p>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: index * 0.1 + 0.2 }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {stat.prefix}
                    <CountUp 
                      end={stat.value} 
                      decimals={stat.decimals || 0}
                      separator=","
                    />
                    {stat.suffix}
                  </motion.div>
                </div>

                {stat.icon && (
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
                      stat.color === 'green' && 'bg-gradient-to-br from-emerald-500 to-teal-500',
                      stat.color === 'blue' && 'bg-gradient-to-br from-blue-500 to-cyan-500',
                      stat.color === 'pink' && 'bg-gradient-to-br from-pink-500 to-rose-500',
                      !stat.color && 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    )}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </div>

              {stat.change !== undefined && (
                <div className="flex items-center justify-between">
                  <div className={cn(
                    'flex items-center gap-1 text-sm font-semibold',
                    changeType === 'up' && 'text-emerald-600',
                    changeType === 'down' && 'text-red-600',
                    changeType === 'neutral' && 'text-gray-500'
                  )}>
                    {changeType === 'up' && <TrendingUp className="w-4 h-4" />}
                    {changeType === 'down' && <TrendingDown className="w-4 h-4" />}
                    {changeType === 'neutral' && <Minus className="w-4 h-4" />}
                    <span>{Math.abs(stat.change)}%</span>
                  </div>

                  {stat.sparkline && (
                    <SparklineChart
                      data={stat.sparkline}
                      color={changeType === 'up' ? '#10b981' : changeType === 'down' ? '#ef4444' : '#6b7280'}
                      height={30}
                      className="w-20"
                    />
                  )}
                </div>
              )}
            </GlowingCard>
          </motion.div>
        );
      })}
    </div>
  );
}