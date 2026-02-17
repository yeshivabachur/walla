import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Navigation, MapPin, Loader2, AlertCircle, CheckCircle, Clock, 
  Users, DollarSign, ArrowRight, Car, PlayCircle, StopCircle, FileText, Calendar as CalendarIcon, TrendingUp, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';
import LiveMap from '@/components/tracking/LiveMap';
import TurnByTurn from '@/components/navigation/TurnByTurn';
import RideChat from '@/components/chat/RideChat';
import VerificationStatus from '@/components/verification/VerificationStatus';
import SafetyMonitor from '@/components/safety/SafetyMonitor';
import OptimizedRoute from '@/components/routes/OptimizedRoute';
import SmartDispatch from '@/components/dispatch/SmartDispatch';
import IncidentDetection from '@/components/safety/IncidentDetection';
import IncentiveTracker from '@/components/driver/IncentiveTracker';
import FatigueMonitor from '@/components/driver/FatigueMonitor';
import RealTimeHeatMap from '@/components/driver/RealTimeHeatMap';
import SmartRouteSuggestion from '@/components/ai/SmartRouteSuggestion';
import DriverCoPilot from '@/components/ai/DriverCoPilot';
import WellBeingMonitor from '@/components/ai/WellBeingMonitor';
import PredictiveMaintenanceAlert from '@/components/vehicle/PredictiveMaintenanceAlert';
import SmartShiftPlanner from '@/components/driver/SmartShiftPlanner';
import FuelEfficiencyTracker from '@/components/driver/FuelEfficiencyTracker';
import DriverBehaviorAnalytics from '@/components/driver/DriverBehaviorAnalytics';
import RealTimeEarningsWidget from '@/components/analytics/RealTimeEarningsWidget';
import QuickActionsPanel from '@/components/driver/QuickActionsPanel';
import DriverHeatmapInsights from '@/components/analytics/DriverHeatmapInsights';
import AICoachingAssistant from '@/components/driver/AICoachingAssistant';
import PerformanceSnapshot from '@/components/driver/PerformanceSnapshot';
import EarningsForecastWidget from '@/components/analytics/EarningsForecastWidget';
import LiveIncidentDetector from '@/components/safety/LiveIncidentDetector';
import DemandHeatmapLive from '@/components/heatmap/DemandHeatmapLive';
import MentorshipHub from '@/components/mentorship/MentorshipHub';
import DriverPerformanceDashboard from '@/components/analytics/DriverPerformanceDashboard';
import FleetManagementCard from '@/components/fleet/FleetManagementCard';
import BurnoutDetector from '@/components/wellness/BurnoutDetector';
import WeeklyReportCard from '@/components/reports/WeeklyReportCard';
import QualityAssuranceMonitor from '@/components/quality/QualityAssuranceMonitor';
import OperationalDashboard from '@/components/operations/OperationalDashboard';
import AutoDispatchOptimizer from '@/components/dispatch/AutoDispatchOptimizer';
import ComplianceTracker from '@/components/compliance/ComplianceTracker';
import RevenueOptimizationEngine from '@/components/revenue/RevenueOptimizationEngine';
import TrainingAnalytics from '@/components/training/TrainingAnalytics';

// Simulate location updates
const simulateLocationUpdate = (origin, destination, progress) => {
  if (!origin?.latitude || !destination?.latitude) return null;
  
  const lat = origin.latitude + (destination.latitude - origin.latitude) * progress;
  const lng = origin.longitude + (destination.longitude - origin.longitude) * progress;
  
  return {
    latitude: lat,
    longitude: lng,
    timestamp: new Date().toISOString()
  };
};

export default function DriverDashboard() {
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [progress, setProgress] = useState(0);
  const [navigationStep, setNavigationStep] = useState(0);
  const [isNavigatingToPickup, setIsNavigatingToPickup] = useState(true);
  const queryClient = useQueryClient();

  // Check driver profile
  const { data: driverProfile } = useQuery({
    queryKey: ['driverProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.DriverProfile.filter({ driver_email: user.email });
      return profiles[0];
    },
    enabled: !!user
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {}
    };
    loadUser();
  }, []);

  // Fetch immediate pending requests (not scheduled or scheduled for today)
  const { data: allPendingRequests = [] } = useQuery({
    queryKey: ['allPendingRequests'],
    queryFn: () => base44.entities.RideRequest.filter({ status: 'pending' }, '-created_date', 50),
    enabled: isOnline,
    refetchInterval: 3000
  });

  // Separate immediate and scheduled requests
  const today = new Date().toISOString().split('T')[0];
  const immediateRequests = allPendingRequests.filter(r => !r.is_scheduled);
  const scheduledRequests = allPendingRequests.filter(r => r.is_scheduled && r.scheduled_date >= today);

  // Fetch driver's active rides
  const { data: myActiveRequests = [] } = useQuery({
    queryKey: ['myActiveRequests', user?.email],
    queryFn: () => base44.entities.RideRequest.filter({ 
      driver_email: user.email,
      status: ['accepted', 'in_progress']
    }),
    enabled: !!user,
    refetchInterval: 3000
  });

  const acceptRequestMutation = useMutation({
    mutationFn: async (request) => {
      const vehicleInfo = driverProfile 
        ? `${driverProfile.vehicle_make} ${driverProfile.vehicle_model} - ${driverProfile.vehicle_color}`
        : 'Toyota Camry - Black';
      
      await base44.entities.RideRequest.update(request.id, {
        status: 'accepted',
        driver_email: user.email,
        driver_name: user.full_name || user.email.split('@')[0],
        vehicle_info: vehicleInfo
      });

      // Send notification to passenger
      await base44.integrations.Core.SendEmail({
        to: request.passenger_email,
        subject: 'Driver Assigned - Walla',
        body: `Hi ${request.passenger_name},

Good news! A driver has been assigned to your ride.

Driver: ${user.full_name || user.email.split('@')[0]}
Vehicle: ${vehicleInfo}
Pickup Location: ${request.pickup_location}

Your driver is on the way. Track your ride in real-time in the app.

Best regards,
Walla Team`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingRequests']);
      queryClient.invalidateQueries(['myActiveRequests']);
      queryClient.invalidateQueries(['allPendingRequests']);
      setIsNavigatingToPickup(true);
      setNavigationStep(0);
      toast.success('Request accepted! Navigate to pickup location.');
    }
  });

  const startTripMutation = useMutation({
    mutationFn: async (request) => {
      await base44.entities.RideRequest.update(request.id, {
        status: 'in_progress',
        current_location: request.pickup_coords
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myActiveRequests']);
      setProgress(0);
      setIsNavigatingToPickup(false);
      setNavigationStep(0);
      toast.success('Trip started! Navigate to drop-off location.');
    }
  });

  const completeTripMutation = useMutation({
    mutationFn: async (request) => {
      await base44.entities.RideRequest.update(request.id, {
        status: 'completed',
        current_location: request.dropoff_coords
      });
      
      // Create earnings record
      const baseFare = request.estimated_price / (request.surge_multiplier || 1);
      const driverEarning = request.estimated_price * 0.8; // 80% to driver
      const commission = request.estimated_price * 0.2; // 20% platform fee
      
      await base44.entities.DriverEarnings.create({
        driver_email: user.email,
        ride_request_id: request.id,
        base_fare: baseFare,
        surge_multiplier: request.surge_multiplier || 1,
        total_fare: request.estimated_price,
        driver_earning: driverEarning,
        commission: commission,
        payout_status: 'pending'
      });

      // Send completion notification to passenger
      await base44.integrations.Core.SendEmail({
        to: request.passenger_email,
        subject: 'Ride Completed - Walla',
        body: `Hi ${request.passenger_name},

Your ride has been completed!

Route: ${request.pickup_location} → ${request.dropoff_location}
Fare: $${request.estimated_price.toFixed(2)}
Driver: ${request.driver_name}

Thank you for riding with Walla! We hope to see you again soon.

Rate your driver in the app to help us maintain quality service.

Best regards,
Walla Team`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myActiveRequests']);
      queryClient.invalidateQueries(['driverEarnings']);
      setActiveRequest(null);
      setProgress(0);
      toast.success('Trip completed! Great job!');
    }
  });

  // Generate turn-by-turn instructions
  const generateInstructions = (origin, destination, isPickup) => {
    const steps = [
      { instruction: 'Head north on Main Street', distance: '0.5 mi' },
      { instruction: 'Turn right onto Oak Avenue', distance: '0.3 mi' },
      { instruction: 'Continue straight for 2 blocks', distance: '0.4 mi' },
      { instruction: 'Turn left onto destination street', distance: '0.2 mi' },
      { instruction: isPickup ? 'Arrive at pickup location' : 'Arrive at drop-off location', distance: '100 ft' }
    ];
    return steps;
  };

  // Simulate location updates for in-progress trips
  useEffect(() => {
    const inProgressRequest = myActiveRequests.find(r => r.status === 'in_progress');
    const acceptedRequest = myActiveRequests.find(r => r.status === 'accepted');
    const activeReq = inProgressRequest || acceptedRequest;
    
    if (!activeReq) return;

    setActiveRequest(activeReq);

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 0.02, 1);
        
        const origin = isNavigatingToPickup ? activeReq.pickup_coords : activeReq.pickup_coords;
        const destination = isNavigatingToPickup ? activeReq.pickup_coords : activeReq.dropoff_coords;
        
        if (origin && destination) {
          const newLocation = simulateLocationUpdate(origin, destination, newProgress);
          base44.entities.RideRequest.update(activeReq.id, { current_location: newLocation });
        }

        // Update navigation step
        const totalSteps = 5;
        const stepProgress = Math.floor(newProgress * totalSteps);
        setNavigationStep(Math.min(stepProgress, totalSteps - 1));

        if (newProgress >= 1 && inProgressRequest) {
          completeTripMutation.mutate(inProgressRequest);
        }

        return newProgress;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [myActiveRequests, isNavigatingToPickup]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
        </div>
      </div>
    );
  }

  // Check if driver needs to complete onboarding
  if (!driverProfile || driverProfile.onboarding_status === 'incomplete') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Profile</h2>
            <p className="text-gray-600 mb-6">
              Before you can start accepting rides, please complete your driver profile.
            </p>
            <Link to={createPageUrl('DriverOnboarding')}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                Complete Onboarding
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (driverProfile.onboarding_status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Verification In Progress</h1>
          <VerificationStatus profile={driverProfile} />
          <Card className="mt-6 border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Verification Active</h2>
              <p className="text-gray-600 mb-4">
                Our automated system is verifying your documents. Most checks complete within 2-4 hours.
              </p>
              <p className="text-sm text-gray-500">
                You'll receive an email notification once verification is complete.
              </p>
              <Link to={createPageUrl('DriverOnboarding')} className="mt-6 inline-block">
                <Button variant="outline" className="rounded-xl">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const acceptedRequest = myActiveRequests.find(r => r.status === 'accepted');
  const inProgressRequest = myActiveRequests.find(r => r.status === 'in_progress');
  const currentRequest = inProgressRequest || acceptedRequest;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Smart Dispatch Background Service */}
      <SmartDispatch />

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Dashboard</h1>
              <p className="text-gray-600">Accept ride requests and manage your trips</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to={createPageUrl('DriverAnalytics')}>
                <Button variant="outline" className="rounded-xl">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Link to={createPageUrl('DriverLoyalty')}>
                <Button variant="outline" className="rounded-xl">
                  <Award className="w-4 h-4 mr-2" />
                  Loyalty
                </Button>
              </Link>
              <Link to={createPageUrl('DriverEarnings')}>
                <Button variant="outline" className="rounded-xl">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Earnings
                </Button>
              </Link>
              <Label htmlFor="online-toggle" className="text-sm font-medium">
                {isOnline ? 'Online' : 'Offline'}
              </Label>
              <Switch
                id="online-toggle"
                checked={isOnline}
                onCheckedChange={setIsOnline}
              />
            </div>
          </div>
        </div>

        {/* Chat Component */}
        {currentRequest && (
          <RideChat
            rideRequestId={currentRequest.id}
            currentUser={user}
            otherParty={{
              name: currentRequest.passenger_name,
              email: currentRequest.passenger_email,
              type: 'passenger'
            }}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          {currentRequest && (
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>Active Trip</CardTitle>
                    <Badge className={
                      currentRequest.status === 'in_progress'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }>
                      {currentRequest.status === 'in_progress' ? (
                        <><Navigation className="w-3 h-3 mr-1 animate-pulse" />In Progress</>
                      ) : (
                        <><Car className="w-3 h-3 mr-1" />Accepted</>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <LiveMap
                    origin={currentRequest.pickup_coords}
                    destination={currentRequest.dropoff_coords}
                    currentLocation={currentRequest.current_location}
                    driverName="You"
                    className="h-[400px] lg:h-[500px]"
                  />
                </CardContent>
                
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {/* Incident Detection */}
                    <IncidentDetection
                      rideRequest={currentRequest}
                      driverEmail={user.email}
                    />

                    {/* Safety Monitor */}
                    <SafetyMonitor 
                      rideRequest={currentRequest}
                      driverEmail={user.email}
                    />

                    {/* Live Incident Detector */}
                    <LiveIncidentDetector
                      rideRequest={currentRequest}
                      driverEmail={user.email}
                    />

                    {/* Route Optimization */}
                    {acceptedRequest && (
                      <OptimizedRoute
                        pickup={{ address: acceptedRequest.pickup_location, coords: acceptedRequest.pickup_coords }}
                        dropoff={{ address: acceptedRequest.dropoff_location, coords: acceptedRequest.dropoff_coords }}
                        scheduledDateTime={acceptedRequest.is_scheduled 
                          ? `${acceptedRequest.scheduled_date} ${acceptedRequest.scheduled_time}`
                          : null
                        }
                      />
                    )}

                    {/* Turn-by-Turn Navigation */}
                    {currentRequest && (
                      <TurnByTurn
                        instructions={generateInstructions(
                          isNavigatingToPickup ? currentRequest.pickup_coords : currentRequest.pickup_coords,
                          isNavigatingToPickup ? currentRequest.pickup_coords : currentRequest.dropoff_coords,
                          isNavigatingToPickup
                        )}
                        currentStep={navigationStep}
                      />
                    )}

                    {/* Trip Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-600" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">Pickup</p>
                            <p className="font-medium">{currentRequest.pickup_location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">Drop-off</p>
                            <p className="font-medium">{currentRequest.dropoff_location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm pt-2 border-t">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            {currentRequest.passengers}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            ${currentRequest.estimated_price}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {inProgressRequest && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Trip Progress</span>
                          <span className="font-semibold text-indigo-600">{Math.round(progress * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      {acceptedRequest && (
                        <Button
                          onClick={() => startTripMutation.mutate(acceptedRequest)}
                          disabled={startTripMutation.isPending}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl h-12"
                        >
                          <PlayCircle className="w-5 h-5 mr-2" />
                          Start Trip
                        </Button>
                      )}
                      {inProgressRequest && (
                        <Button
                          onClick={() => completeTripMutation.mutate(inProgressRequest)}
                          disabled={completeTripMutation.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl h-12"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Complete Trip
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Requests List */}
          <div className={currentRequest ? '' : 'lg:col-span-3'}>
            {/* Quick Actions */}
            {!currentRequest && (
              <div className="mb-6">
                <QuickActionsPanel />
              </div>
            )}

            {/* Performance Dashboard */}
            <div className="mb-6">
              <DriverPerformanceDashboard driverEmail={user.email} />
            </div>

            {/* Performance Snapshot */}
            <div className="mb-6">
              <PerformanceSnapshot driverEmail={user.email} />
            </div>

            {/* Real-Time Earnings */}
            <div className="mb-6">
              <RealTimeEarningsWidget driverEmail={user.email} />
            </div>

            {/* AI Coaching */}
            <div className="mb-6">
              <AICoachingAssistant driverEmail={user.email} />
            </div>

            {/* Earnings Forecast */}
            <div className="mb-6">
              <EarningsForecastWidget driverEmail={user.email} />
            </div>

            {/* Demand Heatmap */}
            <div className="mb-6">
              <DemandHeatmapLive currentZone="Downtown" />
            </div>

            {/* Mentorship Hub */}
            <div className="mb-6">
              <MentorshipHub driverEmail={user.email} />
            </div>

            {/* Fleet Management & Wellness */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <FleetManagementCard driverEmail={user.email} />
              <BurnoutDetector driverEmail={user.email} />
            </div>

            {/* Quality & Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <QualityAssuranceMonitor driverEmail={user.email} />
              <OperationalDashboard zone="Downtown" />
              <AutoDispatchOptimizer zone="Downtown" />
            </div>

            {/* Compliance & Advanced Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ComplianceTracker driverEmail={user.email} />
              <RevenueOptimizationEngine zone="Downtown" />
            </div>

            {/* Maintenance & Training */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <PredictiveMaintenanceAlert driverEmail={user.email} vehicleId={user.email} />
              <TrainingAnalytics driverEmail={user.email} />
            </div>

            {/* Weekly Report */}
            <div className="mb-6">
              <WeeklyReportCard userEmail={user.email} userType="driver" />
            </div>

            {/* Heatmap Insights */}
            {!currentRequest && (
              <div className="mb-6">
                <DriverHeatmapInsights driverEmail={user.email} />
              </div>
            )}
            {/* AI Co-Pilot */}
            {isOnline && !currentRequest && (
              <div className="mb-6">
                <DriverCoPilot driverEmail={user?.email} />
              </div>
            )}

            {/* Well-being Monitor */}
            {isOnline && (
              <div className="mb-6">
                <WellBeingMonitor driverEmail={user?.email} />
              </div>
            )}

            {/* Incentive Tracker */}
            <div className="mb-6">
              <IncentiveTracker driverEmail={user.email} />
            </div>

            {/* Fatigue Monitor */}
            <div className="mb-6">
              <FatigueMonitor driverEmail={user.email} />
            </div>

            {/* Real-Time Heat Map */}
            {!currentRequest && (
              <div className="mb-6">
                <RealTimeHeatMap driverEmail={user.email} />
              </div>
            )}

            {/* Smart Route Suggestion */}
            {!currentRequest && (
              <div className="mb-6">
                <SmartRouteSuggestion 
                  currentLocation="Downtown"
                  timeOfDay={new Date().toLocaleTimeString()}
                />
              </div>
            )}

            {/* Smart Shift Planner */}
            {!currentRequest && (
              <div className="mb-6">
                <SmartShiftPlanner driverEmail={user.email} />
              </div>
            )}

            {/* Fuel Efficiency */}
            {driverProfile?.vehicle_plate && (
              <div className="mb-6">
                <FuelEfficiencyTracker
                  driverEmail={user.email}
                  vehicleId={driverProfile.vehicle_plate}
                />
              </div>
            )}

            {/* Behavior Analytics */}
            <div className="mb-6">
              <DriverBehaviorAnalytics driverEmail={user.email} />
            </div>

            {/* Predictive Maintenance */}
            {driverProfile?.vehicle_plate && (
              <div className="mb-6">
                <PredictiveMaintenanceAlert
                  vehicleId={driverProfile.vehicle_plate}
                  driverEmail={user.email}
                />
              </div>
            )}

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Available Requests</span>
                  {isOnline && (
                    <Badge className="bg-green-100 text-green-800">
                      <Navigation className="w-3 h-3 mr-1" />
                      Online
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isOnline ? (
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Turn on "Online" to start receiving ride requests
                    </AlertDescription>
                  </Alert>
                ) : (immediateRequests.length > 0 || scheduledRequests.length > 0) && !currentRequest ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {/* Immediate Requests */}
                    {immediateRequests.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Immediate Requests
                        </h3>
                        <div className="space-y-2">
                          <AnimatePresence>
                            {immediateRequests.map((request, index) => (
                              <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border-l-4 border-indigo-500">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-gray-900">{request.pickup_location}</span>
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                        <span className="font-semibold text-gray-900">{request.dropoff_location}</span>
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                          <Users className="w-3 h-3" />
                                          {request.passengers}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {request.pickup_time}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xl font-bold text-green-600">${request.estimated_price}</p>
                                      <p className="text-xs text-gray-500">Fare</p>
                                    </div>
                                  </div>
                                  <Button
                                    onClick={() => acceptRequestMutation.mutate(request)}
                                    disabled={acceptRequestMutation.isPending}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                                  >
                                    {acceptRequestMutation.isPending ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                    )}
                                    Accept Request
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* Scheduled Requests */}
                    {scheduledRequests.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          Scheduled Requests
                        </h3>
                        <div className="space-y-2">
                          <AnimatePresence>
                            {scheduledRequests.map((request, index) => (
                              <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <div className="bg-blue-50 rounded-xl p-4 hover:bg-blue-100 transition-colors border-l-4 border-blue-500">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-blue-100 text-blue-800">
                                          {format(new Date(request.scheduled_date), 'MMM d')} at {request.scheduled_time}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-gray-900">{request.pickup_location}</span>
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                        <span className="font-semibold text-gray-900">{request.dropoff_location}</span>
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                          <Users className="w-3 h-3" />
                                          {request.passengers}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xl font-bold text-green-600">${request.estimated_price}</p>
                                      <p className="text-xs text-gray-500">Fare</p>
                                    </div>
                                  </div>
                                  <Button
                                    onClick={() => acceptRequestMutation.mutate(request)}
                                    disabled={acceptRequestMutation.isPending}
                                    className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg"
                                  >
                                    {acceptRequestMutation.isPending ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                    )}
                                    Accept Scheduled Ride
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </div>
                ) : currentRequest ? (
                  <div className="text-center py-8">
                    <Car className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                    <p className="text-gray-900 font-medium">You have an active trip</p>
                    <p className="text-sm text-gray-500 mt-1">Complete your current trip to accept new requests</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No requests available</p>
                    <p className="text-sm text-gray-400 mt-1">New requests will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}