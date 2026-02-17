import React from 'react';
import { motion } from 'framer-motion';
import GradientCard from '@/components/ui/GradientCard';
import CountUp from '@/components/ui/CountUp';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsGridEnhanced({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const isPositive = stat.change >= 0;
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GradientCard gradient={stat.gradient || 'primary'}>
              <div className="p-6">
                {stat.icon && (
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                )}

                <div className="text-3xl font-bold text-white mb-2">
                  {stat.prefix}
                  <CountUp end={stat.value} decimals={stat.decimals || 0} separator="," />
                  {stat.suffix}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                  
                  {stat.change !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="flex items-center gap-1 text-xs text-white/90"
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{Math.abs(stat.change)}%</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </GradientCard>
          </motion.div>
        );
      })}
    </div>
  );
}