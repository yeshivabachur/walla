import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Check } from 'lucide-react';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from '@/lib/utils';

const countries = [
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'India' }
];

export default function PhoneInput({ 
  value = '',
  onChange,
  onValidate,
  className 
}) {
  const [country, setCountry] = useState(countries[0]);
  const [number, setNumber] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleNumberChange = (e) => {
    const formatted = e.target.value.replace(/\D/g, '').slice(0, 10);
    setNumber(formatted);
    
    const fullNumber = country.dial + formatted;
    onChange?.(fullNumber);
    
    const valid = formatted.length >= 10;
    setIsValid(valid);
    onValidate?.(valid);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Phone className="w-4 h-4" />
        Phone Number
      </label>

      <div className="flex gap-2">
        <Select value={country.code} onValueChange={(code) => setCountry(countries.find(c => c.code === code))}>
          <SelectTrigger className="w-32 h-12 rounded-xl">
            <SelectValue>
              <span className="flex items-center gap-2">
                <span className="text-2xl">{country.flag}</span>
                <span className="text-sm">{country.dial}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                <span className="flex items-center gap-2">
                  <span className="text-xl">{c.flag}</span>
                  <span>{c.name}</span>
                  <span className="text-gray-500">{c.dial}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Input
            type="tel"
            value={number}
            onChange={handleNumberChange}
            placeholder="(555) 123-4567"
            className={cn(
              'h-12 pr-12 rounded-xl',
              isValid && 'border-emerald-500 focus-visible:ring-emerald-500'
            )}
          />

          {isValid && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring' }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </div>
      </div>

      {isValid && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-emerald-600 flex items-center gap-1"
        >
          <Check className="w-3 h-3" />
          Valid phone number
        </motion.p>
      )}
    </div>
  );
}