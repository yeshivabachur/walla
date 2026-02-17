import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, Clock, Users, ArrowLeft, Loader2, AlertCircle, 
  Navigation, RefreshCw, Car, DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import LiveMap from '@/components/tracking/LiveMap';
import ETADisplay from '@/components/tracking/ETADisplay';
import ShareTripButton from '@/components/tracking/ShareTripButton';
import RideChat from '@/components/chat/RideChat';
import EmergencyButton from '@/components/safety/EmergencyButton';
import RideExperienceEnhancer from '@/components/ai/RideExperienceEnhancer';
import AutoCheckIn from '@/components/safety/AutoCheckIn';
import RouteDeviationAlert from '@/components/safety/RouteDeviationAlert';
import RealTimeTranslation from '@/components/translation/RealTimeTranslation';
import FamilyRideTracker from '@/components/sharing/FamilyRideTracker';
import InRideEntertainmentHub from '@/components/entertainment/InRideEntertainmentHub';
import QuickIncidentReport from '@/components/incidents/QuickIncidentReport';
import SmartFareSplit from '@/components/splitting/SmartFareSplit';
import AdvancedRouteMonitor from '@/components/safety/AdvancedRouteMonitor';
import LiveSafetyDashboard from '@/components/safety/LiveSafetyDashboard';
import RealTimeRatingWidget from '@/components/rating/RealTimeRatingWidget';
import SmartDriverMatcher from '@/components/matching/SmartDriverMatcher';
import AnomalyDetectionSystem from '@/components/safety/AnomalyDetectionSystem';

      export default function TrackRequest() {
  const urlParams = new URLSearchParams(window.location.search);
  const requestId = urlParams.get('id');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {}
    };
    loadUser();
  }, []);

  // Fetch request details with auto-refresh
  const { data: request, isLoading, refetch } = useQuery({
    queryKey: ['trackRequest', requestId],
    queryFn: async () => {
      const requests = await base44.entities.RideRequest.filter({ id: requestId });
      return requests[0];
    },
    enabled: !!requestId,
    refetchInterval: 3000 // Auto-refresh every 3 seconds
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Request not found</h2>
          <Link to={createPageUrl('Home')}>
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Finding Driver...', icon: Loader2 },
    accepted: { color: 'bg-blue-100 text-blue-800', label: 'Driver Assigned', icon: Car },
    in_progress: { color: 'bg-green-100 text-green-800', label: 'On the Way', icon: Navigation },
    completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed', icon: AlertCircle },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled', icon: AlertCircle }
  };

  const currentStatus = statusConfig[request.status] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('MyRides')} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
            <div className="flex items-center gap-3">
              <Button onClick={() => refetch()} variant="ghost" size="sm" className="rounded-xl">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              {request.status === 'in_progress' && (
                <ShareTripButton rideId={requestId} bookingId={requestId} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Smart Matching */}
        {request.status === 'pending' && user && (
          <SmartDriverMatcher 
            rideRequestId={request.id}
            passengerEmail={user.email}
          />
        )}

        {/* Chat Component */}
        {request.driver_email && (
          <RideChat
            rideRequestId={request.id}
            currentUser={user}
            otherParty={{
              name: request.driver_name,
              email: request.driver_email,
              type: 'driver'
            }}
          />
        )}

        {/* Emergency Button for passengers */}
        {request.status === 'in_progress' && (
          <>
            <EmergencyButton rideRequest={request} userEmail={user?.email} />
            <div className="mb-4">
              <QuickIncidentReport rideRequestId={request.id} userEmail={user?.email} />
            </div>
          </>
        )}

        {/* Smart Fare Split */}
        {request.status === 'completed' && user && (
          <div className="mb-4">
            <SmartFareSplit rideRequest={request} userEmail={user.email} />
          </div>
        )}

        {/* Auto Safety Check-In */}
        {request.status === 'in_progress' && user && (
          <AutoCheckIn rideRequest={request} userEmail={user.email} />
        )}

        {/* Route Deviation Alert */}
        {request.status === 'in_progress' && (
          <RouteDeviationAlert rideRequest={request} />
        )}

        {/* Advanced Route Monitor */}
        {request.status === 'in_progress' && (
          <AdvancedRouteMonitor rideRequest={request} />
        )}

        {/* Anomaly Detection */}
        {request.status === 'in_progress' && (
          <AnomalyDetectionSystem rideRequest={request} />
        )}

        {/* Live Safety Dashboard */}
        {request.status === 'in_progress' && (
          <div className="mb-4">
            <LiveSafetyDashboard rideRequest={request} />
          </div>
        )}

        {/* Real-Time Rating */}
        {request.status === 'in_progress' && user && (
          <div className="mb-4">
            <RealTimeRatingWidget rideRequestId={request.id} userEmail={user.email} />
          </div>
        )}

        {/* Family Ride Tracker */}
        {request.status === 'in_progress' && user && (
          <FamilyRideTracker rideRequest={request} userEmail={user.email} />
        )}

        {/* Real-Time Translation */}
        {request.driver_email && (
          <RealTimeTranslation
            rideRequestId={request.id}
            userLanguage="en"
            otherPartyLanguage="en"
          />
        )}

        {/* In-Ride Entertainment */}
        {request.status === 'in_progress' && user && (
          <InRideEntertainmentHub
            rideRequestId={request.id}
            userEmail={user.email}
            rideDuration={20}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <LiveMap
                    origin={request.pickup_coords}
                    destination={request.dropoff_coords}
                    currentLocation={request.current_location}
                    driverName={request.driver_name}
                    className="h-[400px] lg:h-[600px]"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* ETA Display */}
            {request.status === 'in_progress' && request.current_location && (
              <ETADisplay
                currentLocation={request.current_location}
                destination={request.dropoff_coords}
                status={request.status}
              />
            )}

            {/* AI Local Guide */}
            {request.status === 'in_progress' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <RideExperienceEnhancer
                  destination={request.dropoff_location}
                  userProfile={user}
                />
              </motion.div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Your Ride</h2>
                    <Badge className={currentStatus.color}>
                      <StatusIcon className={`w-3 h-3 mr-1 ${request.status === 'pending' ? 'animate-spin' : ''}`} />
                      {currentStatus.label}
                    </Badge>
                  </div>

                  {/* Route */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                        <div className="w-3 h-3 rounded-full bg-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Pickup</p>
                        <p className="font-semibold text-gray-900">{request.pickup_location}</p>
                      </div>
                    </div>

                    <div className="ml-4 border-l-2 border-dashed border-gray-200 h-8" />

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                        <div className="w-3 h-3 rounded-full bg-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Drop-off</p>
                        <p className="font-semibold text-gray-900">{request.dropoff_location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6 pb-6 border-b">
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {request.passengers} passenger{request.passengers > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Estimated fare: ${request.estimated_price}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Pickup: {request.pickup_time === 'now' ? 'ASAP' : request.pickup_time}
                      </span>
                    </div>
                  </div>

                  {/* Driver Info */}
                  {request.driver_name && (
                    <div>
                      <p className="text-sm text-gray-500 mb-3">Your Driver</p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-semibold">
                          {request.driver_name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{request.driver_name}</p>
                          {request.vehicle_info && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Car className="w-3 h-3" />
                              {request.vehicle_info}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Messages */}
                  {request.status === 'pending' && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="bg-yellow-50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Loader2 className="w-5 h-5 text-yellow-600 animate-spin shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800 mb-1">Searching for drivers...</p>
                            <p className="text-xs text-yellow-700">We're finding the best driver near you</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Driver assigned!</strong> Your driver is on the way to pick you up.
                        </p>
                      </div>
                    </div>
                  )}

                  {request.status === 'in_progress' && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Navigation className="w-4 h-4 text-green-500 animate-pulse" />
                        <span>Live tracking active</span>
                      </div>
                    </div>
                  )}

                  {request.status === 'completed' && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-sm text-green-800">
                          <strong>Trip completed!</strong> Thank you for riding with us.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}