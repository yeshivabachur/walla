import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Fuel, Navigation, Phone, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function QuickActionsPanel() {
  const quickActions = [
    { icon: Coffee, label: 'Break', color: 'bg-amber-500' },
    { icon: Fuel, label: 'Fuel Stop', color: 'bg-blue-500' },
    { icon: Navigation, label: 'Nearby Zones', color: 'bg-green-500' },
    { icon: Phone, label: 'Support', color: 'bg-purple-500' },
    { icon: AlertCircle, label: 'Report', color: 'bg-red-500' }
  ];

  const handleAction = (action) => {
    toast.info(`${action} action triggered`);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</p>
        <div className="grid grid-cols-5 gap-2">
          {quickActions.map((action, idx) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleAction(action.label)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`${action.color} w-10 h-10 rounded-full flex items-center justify-center`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}