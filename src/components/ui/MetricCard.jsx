import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import CountUp from './CountUp';
import ProgressBar from './ProgressBar';

export default function MetricCard({ 
  title,
  value,
  change,
  trend = 'up',
  prefix = '',
  suffix = '',
  decimals = 0,
  icon: Icon,
  color = 'indigo',
  showProgress = false,
  progressValue = 0,
  className 
}) {
  const colors = {
    indigo: 'from-indigo-500 to-purple-600',
    green: 'from-emerald-500 to-teal-600',
    blue: 'from-blue-500 to-cyan-600',
    pink: 'from-pink-500 to-rose-600',
    orange: 'from-orange-500 to-red-600'
  };

  const isPositive = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={cn('glass-strong rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow', className)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
          <div className="text-3xl font-bold text-gray-900">
            {prefix}
            <CountUp end={value} decimals={decimals} />
            {suffix}
          </div>
        </div>

        {Icon && (
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className={cn('w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg', colors[color])}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
        )}
      </div>

      {change !== undefined && (
        <div className={cn(
          'flex items-center gap-1 text-sm font-semibold',
          isPositive ? 'text-emerald-600' : 'text-red-600'
        )}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{Math.abs(change)}%</span>
          <span className="text-gray-500 font-normal">vs last period</span>
        </div>
      )}

      {showProgress && (
        <div className="mt-4">
          <ProgressBar 
            value={progressValue} 
            showLabel={false} 
            height="sm"
            color={color}
          />
        </div>
      )}
    </motion.div>
  );
}