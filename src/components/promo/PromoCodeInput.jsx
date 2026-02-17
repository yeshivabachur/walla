import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function PromoCodeInput({ onPromoApplied, userEmail, estimatedPrice }) {
  const [code, setCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const validatePromoMutation = useMutation({
    mutationFn: async () => {
      const promos = await base44.entities.PromoCode.filter({ 
        code: code.toUpperCase(),
        active: true
      });

      if (promos.length === 0) {
        throw new Error('Invalid promo code');
      }

      const promo = promos[0];

      // Validate expiry
      if (promo.expiry_date && new Date(promo.expiry_date) < new Date()) {
        throw new Error('This promo code has expired');
      }

      // Validate max uses
      if (promo.used_count >= promo.max_uses) {
        throw new Error('This promo code has reached its usage limit');
      }

      // Validate user-specific
      if (promo.user_specific && promo.user_specific !== userEmail) {
        throw new Error('This promo code is not valid for your account');
      }

      // Validate minimum fare
      if (estimatedPrice < promo.min_fare) {
        throw new Error(`Minimum fare of $${promo.min_fare} required`);
      }

      return promo;
    },
    onSuccess: (promo) => {
      setAppliedPromo(promo);
      
      let discount = 0;
      if (promo.discount_type === 'percentage') {
        discount = estimatedPrice * (promo.discount_value / 100);
      } else if (promo.discount_type === 'fixed') {
        discount = promo.discount_value;
      } else if (promo.discount_type === 'free_ride') {
        discount = estimatedPrice;
      }

      const finalPrice = Math.max(0, estimatedPrice - discount);

      onPromoApplied({
        promo,
        discount,
        finalPrice
      });

      toast.success(`Promo applied! You save $${discount.toFixed(2)}`);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const removePromo = () => {
    setAppliedPromo(null);
    setCode('');
    onPromoApplied(null);
    toast.info('Promo code removed');
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {!appliedPromo ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Enter promo code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="pl-10 rounded-xl"
              />
            </div>
            <Button
              onClick={() => validatePromoMutation.mutate()}
              disabled={!code || validatePromoMutation.isPending}
              variant="outline"
              className="rounded-xl"
            >
              Apply
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="applied"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-green-50 border border-green-200 rounded-xl p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-900">
                    {appliedPromo.code}
                  </p>
                  <p className="text-xs text-green-700">
                    {appliedPromo.discount_type === 'percentage'
                      ? `${appliedPromo.discount_value}% off`
                      : appliedPromo.discount_type === 'fixed'
                      ? `$${appliedPromo.discount_value} off`
                      : 'Free ride'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removePromo}
                className="text-green-700 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}