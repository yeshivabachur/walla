import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Zap, Crown, Users, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const vehicles = [
  {
    id: 'standard',
    name: 'Standard',
    icon: Car,
    description: 'Affordable rides',
    capacity: 4,
    priceMultiplier: 1,
    features: ['AC', 'Music'],
    eta: '3 min'
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Crown,
    description: 'Luxury experience',
    capacity: 4,
    priceMultiplier: 1.5,
    features: ['AC', 'Premium Audio', 'Leather Seats', 'Wi-Fi'],
    eta: '5 min'
  },
  {
    id: 'xl',
    name: 'XL',
    icon: Users,
    description: 'Extra space',
    capacity: 6,
    priceMultiplier: 1.3,
    features: ['AC', 'Music', 'Extra Luggage'],
    eta: '4 min'
  },
  {
    id: 'eco',
    name: 'Eco',
    icon: Zap,
    description: 'Electric vehicles',
    capacity: 4,
    priceMultiplier: 1.1,
    features: ['AC', 'Music', '100% Electric'],
    eta: '6 min',
    badge: 'Green'
  }
];

export default function VehicleSelectorEnhanced({ 
  basePrice = 20,
  onSelect,
  selected
}) {
  const [selectedVehicle, setSelectedVehicle] = useState(selected || 'standard');

  const handleSelect = (vehicleId) => {
    setSelectedVehicle(vehicleId);
    const vehicle = vehicles.find(v => v.id === vehicleId);
    onSelect?.(vehicle);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Choose your ride</h3>
      
      {vehicles.map((vehicle, index) => {
        const isSelected = selectedVehicle === vehicle.id;
        const price = (basePrice * vehicle.priceMultiplier).toFixed(2);
        const Icon = vehicle.icon;

        return (
          <motion.button
            key={vehicle.id}
            onClick={() => handleSelect(vehicle.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'w-full text-left p-4 rounded-2xl border-2 transition-all duration-300',
              isSelected
                ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100'
                : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                )}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">{vehicle.name}</h4>
                    {vehicle.badge && (
                      <AnimatedBadge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        {vehicle.badge}
                      </AnimatedBadge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{vehicle.description}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {vehicle.features.map((feature) => (
                      <span key={feature} className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right ml-4">
                <motion.div
                  key={price}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-xl font-bold text-gray-900 mb-1"
                >
                  ${price}
                </motion.div>
                <p className="text-xs text-gray-500">{vehicle.eta} away</p>
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring' }}
                    className="mt-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}