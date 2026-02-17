import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function OTPInput({ 
  length = 6,
  onChange,
  className 
}) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChange?.(newOtp.join(''));

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    const newOtp = [...otp];
    
    pastedData.split('').forEach((char, index) => {
      if (!isNaN(char) && index < length) {
        newOtp[index] = char;
      }
    });
    
    setOtp(newOtp);
    onChange?.(newOtp.join(''));
    inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
  };

  return (
    <div className={cn('flex gap-3 justify-center', className)}>
      {Array.from({ length }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              'w-12 h-14 text-center text-2xl font-bold',
              'border-2 rounded-xl',
              'focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100',
              'transition-all duration-200 outline-none',
              otp[index]
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-300 bg-white'
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}