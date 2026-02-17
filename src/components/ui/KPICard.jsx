import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import GradientCard from './GradientCard';
import CountUp from './CountUp';
import ProgressBar from './ProgressBar';
import { cn } from '@/lib/utils';

export default function KPICard({ 
  title,
  value,
  target,
  unit = '',
  change,
  icon: Icon,
  gradient = 'primary',
  className 
}) {
  const progress = target ? (value / target) * 100 : 0;
  const isPositive = change >= 0;
  const isOnTrack = progress >= 70;

  return (
    <GradientCard gradient={gradient} className={cn('p-6', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-3">{title}</p>
          
          <div className="flex items-baseline gap-2 mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-4xl font-bold text-white"
            >
              <CountUp end={value} />
            </motion.div>
            <span className="text-white/80 text-lg">{unit}</span>
          </div>

          {target && (
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Target className="w-4 h-4" />
              <span>Target: {target}{unit}</span>
            </div>
          )}
        </div>

        {Icon && (
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
        )}
      </div>

      {change !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mb-4"
        >
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full',
            isPositive ? 'bg-emerald-500/20' : 'bg-red-500/20'
          )}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3 text-white" />
            ) : (
              <TrendingDown className="w-3 h-3 text-white" />
            )}
            <span className="text-xs font-semibold text-white">
              {Math.abs(change)}%
            </span>
          </div>
          <span className="text-xs text-white/70">vs last period</span>
        </motion.div>
      )}

      {target && (
        <div>
          <div className="flex justify-between text-xs text-white/80 mb-2">
            <span>Progress</span>
            <span className="font-semibold">{progress.toFixed(0)}%</span>
          </div>
          <ProgressBar
            value={progress}
            showLabel={false}
            color={isOnTrack ? 'green' : 'blue'}
            height="sm"
          />
        </div>
      )}
    </GradientCard>
  );
}