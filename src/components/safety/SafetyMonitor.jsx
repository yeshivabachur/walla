import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, Shield, Eye, Activity, Phone, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function SafetyMonitor({ rideRequest, driverEmail }) {
  const [fatigueScore, setFatigueScore] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const queryClient = useQueryClient();

  // Simulate camera-based fatigue detection
  useEffect(() => {
    if (!rideRequest || rideRequest.status !== 'in_progress') return;

    const interval = setInterval(() => {
      // Simulate fatigue detection AI (0-100 score)
      const score = Math.random() * 100;
      setFatigueScore(score);

      // Simulate speed monitoring
      const speed = 30 + Math.random() * 40;
      setCurrentSpeed(speed);

      // Check for safety issues
      if (score > 70) {
        createAlert('fatigue', 'high', 'High fatigue level detected. Please take a break.');
      } else if (speed > 65) {
        createAlert('speeding', 'medium', `Speeding detected: ${Math.round(speed)} mph`);
      }

      // Critical alert - notify emergency contacts
      if (score > 90) {
        handleEmergencyAlert('Critical fatigue detected');
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [rideRequest]);

  const createAlertMutation = useMutation({
    mutationFn: async (alertData) => {
      return await base44.entities.SafetyAlert.create(alertData);
    },
    onSuccess: (alert) => {
      setAlerts(prev => [alert, ...prev]);
      queryClient.invalidateQueries(['safetyAlerts']);
    }
  });

  const createAlert = async (type, severity, description) => {
    // Don't create duplicate alerts
    if (alerts.some(a => a.alert_type === type && a.status === 'active')) return;

    const alertData = {
      driver_email: driverEmail,
      ride_request_id: rideRequest.id,
      alert_type: type,
      severity,
      description,
      location: rideRequest.current_location,
      speed: currentSpeed,
      status: 'active'
    };

    createAlertMutation.mutate(alertData);
    toast.error(description, { duration: 5000 });
  };

  const handleEmergencyAlert = async (reason) => {
    // Get driver and passenger info
    const driverUser = await base44.entities.User.filter({ email: driverEmail });
    const passenger = await base44.entities.User.filter({ email: rideRequest.passenger_email });

    // Notify emergency contacts
    if (driverUser[0]?.emergency_contact_phone) {
      await base44.integrations.Core.SendEmail({
        to: driverUser[0].emergency_contact_phone + '@sms-gateway.com', // SMS gateway simulation
        subject: 'Emergency Alert - Walla Driver',
        body: `EMERGENCY: ${driverUser[0].full_name || driverEmail} may need assistance. ${reason}. Current location: ${rideRequest.current_location?.latitude}, ${rideRequest.current_location?.longitude}`
      });
    }

    // Notify passenger
    if (passenger[0]) {
      await base44.integrations.Core.SendEmail({
        to: passenger[0].email,
        subject: 'Safety Alert - Your Ride',
        body: `We detected a potential safety issue with your current ride. Our team has been notified and is monitoring the situation. Emergency services may be contacted if needed.`
      });
    }

    // Mark alert as emergency contacted
    const alertData = {
      driver_email: driverEmail,
      ride_request_id: rideRequest.id,
      alert_type: 'accident',
      severity: 'critical',
      description: reason,
      location: rideRequest.current_location,
      status: 'active',
      emergency_contacted: true
    };

    createAlertMutation.mutate(alertData);
  };

  const acknowledgeAlert = async (alert) => {
    await base44.entities.SafetyAlert.update(alert.id, { status: 'acknowledged' });
    setAlerts(prev => prev.filter(a => a.id !== alert.id));
    toast.success('Alert acknowledged');
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');

  return (
    <>
      {/* Safety Status Bar */}
      <Card className="border-0 shadow-lg mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className={`w-5 h-5 ${activeAlerts.length > 0 ? 'text-red-600' : 'text-green-600'}`} />
                <span className="text-sm font-semibold">
                  {activeAlerts.length > 0 ? 'Safety Alert' : 'All Clear'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  Fatigue: {Math.round(fatigueScore)}%
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  Speed: {Math.round(currentSpeed)} mph
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <AnimatePresence>
        {activeAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <Alert className={`border-2 ${
              alert.severity === 'critical' || alert.severity === 'high'
                ? 'border-red-500 bg-red-50'
                : 'border-yellow-500 bg-yellow-50'
            }`}>
              <AlertTriangle className={`w-4 h-4 ${
                alert.severity === 'critical' || alert.severity === 'high'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`} />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <p className={`font-semibold ${
                    alert.severity === 'critical' || alert.severity === 'high'
                      ? 'text-red-800'
                      : 'text-yellow-800'
                  }`}>
                    {alert.description}
                  </p>
                  {alert.severity === 'critical' && (
                    <p className="text-xs text-red-700 mt-1">
                      Emergency services may be contacted automatically
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => acknowledgeAlert(alert)}
                  className="rounded-lg ml-4"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Acknowledge
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}