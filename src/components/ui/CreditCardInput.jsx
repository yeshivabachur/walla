import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

export default function CreditCardInput({ 
  onChange,
  className 
}) {
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [focused, setFocused] = useState('');

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || value;
  };

  const formatExpiry = (value) => {
    return value.replace(/\D/g, '').match(/.{1,2}/g)?.join('/') || value;
  };

  const handleChange = (field, value) => {
    let formatted = value;
    
    if (field === 'number') {
      formatted = formatCardNumber(value.replace(/\D/g, '').slice(0, 16));
    } else if (field === 'expiry') {
      formatted = formatExpiry(value.slice(0, 5));
    } else if (field === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 3);
    }

    const updated = { ...cardData, [field]: formatted };
    setCardData(updated);
    onChange?.(updated);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Card preview */}
      <motion.div
        animate={{
          rotateY: focused === 'cvv' ? 180 : 0
        }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-52"
      >
        {/* Front */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 shadow-2xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex justify-between items-start mb-12">
            <div className="w-12 h-12 bg-yellow-400 rounded-lg opacity-80" />
            <CreditCard className="w-8 h-8 text-white/80" />
          </div>

          <div className="space-y-4">
            <div className="text-white font-mono text-xl tracking-wider">
              {cardData.number || '•••• •••• •••• ••••'}
            </div>

            <div className="flex justify-between items-end">
              <div>
                <div className="text-white/60 text-xs mb-1">Card Holder</div>
                <div className="text-white font-medium">
                  {cardData.name || 'YOUR NAME'}
                </div>
              </div>

              <div>
                <div className="text-white/60 text-xs mb-1">Expires</div>
                <div className="text-white font-medium">
                  {cardData.expiry || 'MM/YY'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="w-full h-12 bg-gray-700 mb-8 mt-4" />
          
          <div className="flex justify-end">
            <div className="bg-white px-4 py-2 rounded text-gray-900 font-mono">
              {cardData.cvv || '•••'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Card Number</label>
          <Input
            type="text"
            value={cardData.number}
            onChange={(e) => handleChange('number', e.target.value)}
            onFocus={() => setFocused('number')}
            onBlur={() => setFocused('')}
            placeholder="1234 5678 9012 3456"
            className="h-12 rounded-xl font-mono"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Card Holder Name</label>
          <Input
            type="text"
            value={cardData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused('')}
            placeholder="John Doe"
            className="h-12 rounded-xl uppercase"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Expiry Date</label>
            <Input
              type="text"
              value={cardData.expiry}
              onChange={(e) => handleChange('expiry', e.target.value)}
              onFocus={() => setFocused('expiry')}
              onBlur={() => setFocused('')}
              placeholder="MM/YY"
              className="h-12 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1">
              CVV
              <Lock className="w-3 h-3 text-gray-400" />
            </label>
            <Input
              type="text"
              value={cardData.cvv}
              onChange={(e) => handleChange('cvv', e.target.value)}
              onFocus={() => setFocused('cvv')}
              onBlur={() => setFocused('')}
              placeholder="123"
              className="h-12 rounded-xl font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}