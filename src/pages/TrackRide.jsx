import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, Calendar, Clock, Users, Car, ArrowLeft, 
  Loader2, AlertCircle, Navigation, RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import LiveMap from '@/components/tracking/LiveMap';
import ETADisplay from '@/components/tracking/ETADisplay';
import ShareTripButton from '@/components/tracking/ShareTripButton';

export default function TrackRide() {
  const urlParams = new URLSearchParams(window.location.search);
  const rideId = urlParams.get('id');
  const bookingId = urlParams.get('booking');
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

  // Fetch ride details with auto-refresh every 5 seconds
  const { data: ride, isLoading, refetch } = useQuery({
    queryKey: ['trackRide', rideId],
    queryFn: async () => {
      const rides = await base44.entities.Ride.filter({ id: rideId });
      return rides[0];
    },
    enabled: !!rideId,
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });

  const { data: booking } = useQuery({
    queryKey: ['trackBooking', bookingId],
    queryFn: async () => {
      const bookings = await base44.entities.Booking.filter({ id: bookingId });
      return bookings[0];
    },
    enabled: !!bookingId
  });

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ride not found</h2>
          <Link to={createPageUrl('Home')}>
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    active: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
    in_progress: { color: 'bg-green-100 text-green-800', label: 'In Progress' },
    completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
  };

  const currentStatus = statusConfig[ride.status] || statusConfig.active;

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
              <Button
                onClick={handleRefresh}
                variant="ghost"
                size="sm"
                className="rounded-xl"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              {user && booking && (
                <ShareTripButton rideId={rideId} bookingId={bookingId} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <LiveMap
                    origin={ride.origin_coords}
                    destination={ride.destination_coords}
                    currentLocation={ride.current_location}
                    driverName={ride.driver_name}
                    className="h-[400px] lg:h-[600px]"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* ETA Display */}
            {ride.status === 'in_progress' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ETADisplay
                  currentLocation={ride.current_location}
                  destination={ride.destination_coords}
                  status={ride.status}
                />
              </motion.div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Trip Details</h2>
                    <Badge className={currentStatus.color}>
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
                        <p className="font-semibold text-gray-900">{ride.origin}</p>
                      </div>
                    </div>

                    <div className="ml-4 border-l-2 border-dashed border-gray-200 h-8" />

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                        <div className="w-3 h-3 rounded-full bg-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Drop-off</p>
                        <p className="font-semibold text-gray-900">{ride.destination}</p>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="space-y-3 mb-6 pb-6 border-b">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {ride.date ? format(new Date(ride.date), 'EEEE, MMMM d, yyyy') : '-'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{ride.time}</span>
                    </div>
                    {booking && (
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {booking.seats_booked} seat{booking.seats_booked > 1 ? 's' : ''} booked
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Driver Info */}
                  <div>
                    <p className="text-sm text-gray-500 mb-3">Driver</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-semibold">
                        {ride.driver_name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{ride.driver_name}</p>
                        {ride.vehicle_info && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Car className="w-3 h-3" />
                            {ride.vehicle_info}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Real-time Updates Info */}
                  {ride.status === 'in_progress' && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Navigation className="w-4 h-4 text-green-500 animate-pulse" />
                        <span>Live tracking active</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Location updates every 5 seconds
                      </p>
                    </div>
                  )}

                  {ride.status === 'active' && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Scheduled:</strong> Tracking will begin when the driver starts the trip.
                        </p>
                      </div>
                    </div>
                  )}

                  {ride.status === 'completed' && (
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