import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Navigation, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RouteDeviationAlert({ rideRequest, onAcknowledge }) {
  const [showAlert, setShowAlert] = useState(false);
  const [deviation, setDeviation] = useState(0);

  useEffect(() => {
    if (rideRequest.status !== 'in_progress') return;

    const checkDeviation = setInterval(() => {
      // Simulate route deviation check
      const randomDeviation = Math.random() * 3;
      setDeviation(randomDeviation);

      if (randomDeviation > 2) {
        setShowAlert(true);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkDeviation);
  }, [rideRequest.status]);

  if (!showAlert) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 left-0 right-0 z-50 px-4"
    >
      <Card className="max-w-md mx-auto border-2 border-orange-500 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Route Deviation Detected</h3>
              <p className="text-sm text-gray-600 mb-3">
                Your driver has taken a different route than expected. This could be due to traffic or road closures.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowAlert(false);
                    onAcknowledge?.();
                  }}
                  size="sm"
                  className="flex-1 rounded-xl bg-gray-900 hover:bg-gray-800"
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  OK
                </Button>
                <Button
                  onClick={() => window.open('tel:911')}
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-orange-500 text-orange-600"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}