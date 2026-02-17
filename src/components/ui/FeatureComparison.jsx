import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FeatureComparison({ 
  products,
  features,
  className 
}) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-block min-w-full"
      >
        <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
          {/* Header row */}
          <div className="font-bold text-gray-900 flex items-end pb-4">Features</div>
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'glass rounded-2xl p-6 text-center',
                product.highlighted && 'ring-2 ring-indigo-500 scale-105'
              )}
            >
              {product.highlighted && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 mb-3">
                  <Star className="w-3 h-3 fill-white" />
                  Recommended
                </div>
              )}
              
              <h3 className="font-bold text-xl text-gray-900 mb-2">{product.name}</h3>
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                ${product.price}
              </div>
              <div className="text-sm text-gray-600">{product.period}</div>
            </motion.div>
          ))}

          {/* Feature rows */}
          {features.map((feature, featureIndex) => (
            <React.Fragment key={feature.name}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: featureIndex * 0.05 }}
                className="flex items-center py-4 border-t border-gray-200 font-medium text-gray-700"
              >
                {feature.name}
              </motion.div>
              
              {products.map((product, productIndex) => (
                <motion.div
                  key={`${feature.name}-${product.name}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: featureIndex * 0.05 + productIndex * 0.03, type: 'spring' }}
                  className="flex items-center justify-center py-4 border-t border-gray-200"
                >
                  {feature.values[productIndex] === true ? (
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                  ) : feature.values[productIndex] === false ? (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <X className="w-5 h-5 text-gray-400" />
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-gray-700">
                      {feature.values[productIndex]}
                    </span>
                  )}
                </motion.div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
}