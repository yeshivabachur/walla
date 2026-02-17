import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, MoreVertical } from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import SparklineChart from './SparklineChart';
import CountUp from './CountUp';
import { cn } from '@/lib/utils';

export default function DataCard({ 
  title,
  value,
  change,
  trend,
  sparklineData,
  icon: Icon,
  color = 'indigo',
  suffix = '',
  prefix = '',
  decimals = 0,
  className 
}) {
  const colors = {
    indigo: {
      bg: 'from-indigo-500 to-purple-600',
      text: 'text-indigo-600',
      light: 'bg-indigo-50'
    },
    green: {
      bg: 'from-emerald-500 to-teal-600',
      text: 'text-emerald-600',
      light: 'bg-emerald-50'
    },
    blue: {
      bg: 'from-blue-500 to-cyan-600',
      text: 'text-blue-600',
      light: 'bg-blue-50'
    },
    pink: {
      bg: 'from-pink-500 to-rose-600',
      text: 'text-pink-600',
      light: 'bg-pink-50'
    }
  };

  const changeType = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

  return (
    <SpotlightCard className={cn('p-6', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-3xl font-bold text-gray-900"
          >
            {prefix}
            <CountUp end={value} decimals={decimals} separator="," />
            {suffix}
          </motion.div>
        </div>

        {Icon && (
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br',
              colors[color].bg
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
        )}
      </div>

      {change !== undefined && (
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            'flex items-center gap-1 text-sm font-semibold',
            changeType === 'up' && 'text-emerald-600',
            changeType === 'down' && 'text-red-600',
            changeType === 'neutral' && 'text-gray-500'
          )}>
            {changeType === 'up' && <TrendingUp className="w-4 h-4" />}
            {changeType === 'down' && <TrendingDown className="w-4 h-4" />}
            {changeType === 'neutral' && <Minus className="w-4 h-4" />}
            <span>{Math.abs(change)}%</span>
            <span className="text-gray-500 font-normal">vs last period</span>
          </div>
        </div>
      )}

      {sparklineData && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.3 }}
          className="-mx-2 -mb-2"
        >
          <SparklineChart
            data={sparklineData}
            color={changeType === 'up' ? '#10b981' : changeType === 'down' ? '#ef4444' : '#667eea'}
            height={60}
          />
        </motion.div>
      )}
    </SpotlightCard>
  );
}