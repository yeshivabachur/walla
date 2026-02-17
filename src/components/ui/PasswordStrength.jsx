import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Eye, EyeOff } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

export default function PasswordStrength({ 
  value = '',
  onChange,
  className 
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  const checks = [
    { label: 'At least 8 characters', test: value.length >= 8 },
    { label: 'Contains uppercase', test: /[A-Z]/.test(value) },
    { label: 'Contains lowercase', test: /[a-z]/.test(value) },
    { label: 'Contains number', test: /[0-9]/.test(value) },
    { label: 'Contains special character', test: /[^A-Za-z0-9]/.test(value) }
  ];

  const strength = checks.filter(c => c.test).length;
  const strengthPercentage = (strength / checks.length) * 100;

  const getStrengthColor = () => {
    if (strength <= 1) return 'from-red-500 to-red-600';
    if (strength <= 3) return 'from-yellow-500 to-orange-500';
    return 'from-emerald-500 to-teal-500';
  };

  const getStrengthLabel = () => {
    if (strength <= 1) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Enter password"
          className="h-12 pr-12 rounded-xl"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          {/* Strength bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Password strength</span>
              <span className={cn(
                'font-semibold',
                strength <= 1 ? 'text-red-600' : strength <= 3 ? 'text-yellow-600' : 'text-emerald-600'
              )}>
                {getStrengthLabel()}
              </span>
            </div>

            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={cn('h-full bg-gradient-to-r rounded-full', getStrengthColor())}
                initial={{ width: 0 }}
                animate={{ width: `${strengthPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            {checks.map((check, index) => (
              <motion.div
                key={check.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 text-sm"
              >
                <div className={cn(
                  'w-4 h-4 rounded-full flex items-center justify-center',
                  check.test ? 'bg-emerald-500' : 'bg-gray-300'
                )}>
                  {check.test ? (
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  ) : (
                    <X className="w-3 h-3 text-white" strokeWidth={3} />
                  )}
                </div>
                <span className={check.test ? 'text-emerald-600' : 'text-gray-500'}>
                  {check.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}