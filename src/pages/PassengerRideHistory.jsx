import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, ArrowRight, Star, Heart, Repeat, Loader2, Search,
  Calendar, DollarSign, User, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FavoriteRoutesManager from '@/components/rides/FavoriteRoutesManager';
import DriverRatingCard from '@/components/rides/DriverRatingCard';

export default function PassengerRideHistory() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDriver, setFilterDriver] = useState('all');
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {}
    };
    loadUser();
  }, []);

  const { data: rides = [], isLoading } = useQuery({
    queryKey: ['passengerRides', user?.email],
    queryFn: () => base44.entities.RideRequest.filter({ passenger_email: user.email }, '-created_date'),
    enabled: !!user
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['passengerReviews', user?.email],
    queryFn: () => base44.entities.Review.filter({ reviewer_email: user.email }),
    enabled: !!user
  });

  const { data: favoriteRoutes = [] } = useQuery({
    queryKey: ['favoriteRoutes', user?.email],
    queryFn: () => base44.entities.FavoriteRoute.filter({ passenger_email: user.email }),
    enabled: !!user
  });

  const rebookMutation = useMutation({
    mutationFn: async (ride) => {
      return await base44.entities.RideRequest.create({
        passenger_name: user.full_name || user.email.split('@')[0],
        passenger_email: user.email,
        pickup_location: ride.pickup_location,
        dropoff_location: ride.dropoff_location,
        pickup_coords: ride.pickup_coords,
        dropoff_coords: ride.dropoff_coords,
        pickup_time: 'now',
        passengers: ride.passengers,
        estimated_price: ride.estimated_price,
        surge_multiplier: 1.0,
        status: 'pending'
      });
    },
    onSuccess: (data) => {
      toast.success('Ride rebooked successfully!');
      navigate(createPageUrl(`TrackRequest?id=${data.id}`));
    }
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (driverEmail) => {
      const favorites = user.favorite_driver_emails || [];
      const newFavorites = favorites.includes(driverEmail)
        ? favorites.filter(e => e !== driverEmail)
        : [...favorites, driverEmail];
      
      await base44.auth.updateMe({ favorite_driver_emails: newFavorites });
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['currentUser']);
      toast.success('Favorites updated');
    }
  });

  const completedRides = rides.filter(r => r.status === 'completed');
  const uniqueDrivers = [...new Set(completedRides.map(r => r.driver_email).filter(Boolean))];

  const filteredRides = completedRides.filter(ride => {
    const matchesSearch = searchQuery === '' || 
      ride.pickup_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.dropoff_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.driver_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDriver = filterDriver === 'all' || ride.driver_email === filterDriver;
    
    return matchesSearch && matchesDriver;
  });

  const getDriverReview = (rideId, driverEmail) => {
    return reviews.find(r => r.ride_id === rideId && r.reviewee_email === driverEmail);
  };

  const isFavoriteDriver = (driverEmail) => {
    return user?.favorite_driver_emails?.includes(driverEmail) || false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ride History</h1>

        <Tabs defaultValue="history" className="mb-8">
          <TabsList className="bg-white border mb-6">
            <TabsTrigger value="history">All Rides ({completedRides.length})</TabsTrigger>
            <TabsTrigger value="favorites">Favorite Routes</TabsTrigger>
            <TabsTrigger value="drivers">Drivers ({uniqueDrivers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            {/* Search and Filter */}
            <Card className="border-0 shadow-lg mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by location or driver..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={filterDriver}
                      onChange={(e) => setFilterDriver(e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="all">All Drivers</option>
                      {uniqueDrivers.map(email => {
                        const ride = completedRides.find(r => r.driver_email === email);
                        return (
                          <option key={email} value={email}>
                            {ride?.driver_name || email}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rides List */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredRides.map((ride, index) => {
                  const review = getDriverReview(ride.id, ride.driver_email);
                  return (
                    <motion.div
                      key={ride.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <MapPin className="w-4 h-4 text-indigo-600" />
                                <span className="font-semibold text-gray-900">{ride.pickup_location}</span>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold text-gray-900">{ride.dropoff_location}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(ride.created_date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  ${ride.estimated_price}
                                </span>
                                {ride.driver_name && (
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {ride.driver_name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              {ride.driver_email && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleFavoriteMutation.mutate(ride.driver_email)}
                                  className={isFavoriteDriver(ride.driver_email) ? 'text-red-600' : 'text-gray-400'}
                                >
                                  <Heart className={`w-4 h-4 ${isFavoriteDriver(ride.driver_email) ? 'fill-current' : ''}`} />
                                </Button>
                              )}
                            </div>
                          </div>

                          {review && (
                            <div className="bg-yellow-50 rounded-lg p-3 mb-4 flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-600 fill-current" />
                              <span className="text-sm text-gray-700">
                                You rated this ride: <strong>{review.rating}/5</strong>
                              </span>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => rebookMutation.mutate(ride)}
                              disabled={rebookMutation.isPending}
                              className="flex-1"
                            >
                              <Repeat className="w-4 h-4 mr-2" />
                              Rebook
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredRides.length === 0 && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500">No rides found matching your search</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <FavoriteRoutesManager userEmail={user?.email} />
          </TabsContent>

          <TabsContent value="drivers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueDrivers.map((driverEmail) => {
                const driverRides = completedRides.filter(r => r.driver_email === driverEmail);
                const driverName = driverRides[0]?.driver_name;
                const driverReviews = reviews.filter(r => r.reviewee_email === driverEmail);
                const avgRating = driverReviews.length > 0
                  ? driverReviews.reduce((sum, r) => sum + r.rating, 0) / driverReviews.length
                  : 0;

                return (
                  <DriverRatingCard
                    key={driverEmail}
                    driverEmail={driverEmail}
                    driverName={driverName}
                    ridesCount={driverRides.length}
                    averageRating={avgRating}
                    isFavorite={isFavoriteDriver(driverEmail)}
                    onToggleFavorite={() => toggleFavoriteMutation.mutate(driverEmail)}
                  />
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}