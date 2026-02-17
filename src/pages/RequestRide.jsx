import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users, Loader2, CheckCircle, Clock, DollarSign, TrendingUp, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import BlobBackground from '@/components/ui/BlobBackground';
import AnimatedInput from '@/components/ui/AnimatedInput';
import VehicleSelectorEnhanced from '@/components/enhanced/VehicleSelectorEnhanced';
import PricingCardEnhanced from '@/components/enhanced/PricingCardEnhanced';
import SegmentedControl from '@/components/ui/SegmentedControl';
import MorphButton from '@/components/ui/MorphButton';
import SearchBar from '@/components/ui/SearchBar';
import OptimizedRoute from '@/components/routes/OptimizedRoute';
import SurgePricingMap from '@/components/maps/SurgePricingMap';
import HolographicRidePreview from '@/components/ui/HolographicRidePreview';
import RideRecommendations from '@/components/personalization/RideRecommendations';
import ProactiveRideAssistant from '@/components/ai/ProactiveRideAssistant';
import SmartWaitNotifier from '@/components/ai/SmartWaitNotifier';
import RiskAssessmentDisplay from '@/components/ai/RiskAssessmentDisplay';
import PromoCodeInput from '@/components/promo/PromoCodeInput';
import FavoriteLocations from '@/components/locations/FavoriteLocations';
import RidePoolOption from '@/components/pool/RidePoolOption';
import AccessibilityOptions from '@/components/accessibility/AccessibilityOptions';
import WeatherAwareRouting from '@/components/weather/WeatherAwareRouting';
import EventRideRecommendations from '@/components/events/EventRideRecommendations';
import PriceForecast from '@/components/predictions/PriceForecast';
import TransitComparison from '@/components/multimodal/TransitComparison';
import EcoVehicleMatch from '@/components/eco/EcoVehicleMatch';
import GroupRideCoordinator from '@/components/groups/GroupRideCoordinator';
import PetRideOptions from '@/components/pets/PetRideOptions';
import LiveTrafficUpdates from '@/components/traffic/LiveTrafficUpdates';
import QuantumRouteOptimizer from '@/components/ai/QuantumRouteOptimizer';
import AutonomousVehicleSelector from '@/components/autonomous/AutonomousVehicleSelector';
import PredictiveRideBooking from '@/components/future/PredictiveRideBooking';
import MoodBasedCustomization from '@/components/mood/MoodBasedCustomization';
import SmartDestinationSuggestions from '@/components/destinations/SmartDestinationSuggestions';
import VoiceRideAssistant from '@/components/voice/VoiceRideAssistant';
import PremiumExperienceSelector from '@/components/premium/PremiumExperienceSelector';
import TripPlanner from '@/components/planning/TripPlanner';
import WeatherVehicleMatch from '@/components/weather/WeatherVehicleMatch';
import RideMatchmaking from '@/components/social/RideMatchmaking';
import DynamicPricingInsights from '@/components/pricing/DynamicPricingInsights';
import SmartETAPredictor from '@/components/eta/SmartETAPredictor';
import RouteOptimizationEngine from '@/components/optimization/RouteOptimizationEngine';
import SurgePredictionCard from '@/components/predictions/SurgePredictionCard';
import PreferenceLearningEngine from '@/components/learning/PreferenceLearningEngine';
import DestinationClusterAnalysis from '@/components/clustering/DestinationClusterAnalysis';

// City coordinates for demo
const CITY_COORDS = {
  'San Francisco': { latitude: 37.7749, longitude: -122.4194 },
  'Los Angeles': { latitude: 34.0522, longitude: -118.2437 },
  'New York': { latitude: 40.7128, longitude: -74.006 },
  'Boston': { latitude: 42.3601, longitude: -71.0589 },
  'Seattle': { latitude: 47.6062, longitude: -122.3321 },
  'Portland': { latitude: 45.5152, longitude: -122.6784 },
  'Chicago': { latitude: 41.8781, longitude: -87.6298 },
  'Austin': { latitude: 30.2672, longitude: -97.7431 },
  'Houston': { latitude: 29.7604, longitude: -95.3698 },
  'Miami': { latitude: 25.7617, longitude: -80.1918 }
};

// Calculate distance and estimate price
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export default function RequestRide() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    pickup_location: '',
    dropoff_location: '',
    pickup_time: 'now',
    passengers: '1',
    notes: '',
    is_scheduled: false,
    scheduled_date: null,
    scheduled_time: ''
  });
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);
  const [promoData, setPromoData] = useState(null);
  const [poolEnabled, setPoolEnabled] = useState(false);
  const [accessibilityNeeds, setAccessibilityNeeds] = useState([]);
  const [ecoEnabled, setEcoEnabled] = useState(false);
  const [showGroupRide, setShowGroupRide] = useState(false);
  const [petRide, setPetRide] = useState(false);
  const [petConfig, setPetConfig] = useState({ type: 'dog', size: 'medium' });
  const [premiumExperience, setPremiumExperience] = useState(null);

  // Pre-fill from navigation state (for rebooking)
  useEffect(() => {
    const state = window.history.state?.usr;
    if (state) {
      setFormData(prev => ({
        ...prev,
        pickup_location: state.pickup_location || prev.pickup_location,
        dropoff_location: state.dropoff_location || prev.dropoff_location,
        passengers: state.passengers?.toString() || prev.passengers
      }));
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {}
    };
    loadUser();
  }, []);

  // Fetch pending requests to calculate demand
  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['demandCheck'],
    queryFn: () => base44.entities.RideRequest.filter({ status: 'pending' }),
    refetchInterval: 10000
  });

  // Calculate surge pricing
  useEffect(() => {
    const hour = new Date().getHours();
    const isPeakHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19);
    const demand = pendingRequests.length;

    let surge = 1.0;
    if (demand > 10) surge = 1.5;
    else if (demand > 5) surge = 1.3;
    else if (demand > 3) surge = 1.2;

    if (isPeakHour) surge += 0.2;

    setSurgeMultiplier(Math.min(surge, 2.5));
  }, [pendingRequests]);

  useEffect(() => {
    // Calculate estimated price when locations change
    if (formData.pickup_location && formData.dropoff_location) {
      const pickupCoords = CITY_COORDS[formData.pickup_location];
      const dropoffCoords = CITY_COORDS[formData.dropoff_location];
      
      if (pickupCoords && dropoffCoords) {
        const distance = calculateDistance(
          pickupCoords.latitude, pickupCoords.longitude,
          dropoffCoords.latitude, dropoffCoords.longitude
        );
        // Base fare $5 + $2 per km, with surge
        const basePrice = 5 + (distance * 2);
        const price = Math.round(basePrice * surgeMultiplier);
        setEstimatedPrice(price);
      }
    } else {
      setEstimatedPrice(null);
    }
  }, [formData.pickup_location, formData.dropoff_location, surgeMultiplier]);

  const requestMutation = useMutation({
    mutationFn: async (requestData) => {
      return await base44.entities.RideRequest.create(requestData);
    },
    onSuccess: (data) => {
      toast.success('Ride requested! Searching for nearby drivers...');
      navigate(createPageUrl(`TrackRequest?id=${data.id}`));
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to request a ride');
      return;
    }

    if (!formData.pickup_location || !formData.dropoff_location) {
      toast.error('Please select pickup and drop-off locations');
      return;
    }

    const pickupCoords = CITY_COORDS[formData.pickup_location];
    const dropoffCoords = CITY_COORDS[formData.dropoff_location];

    // Apply premium experience multiplier
    let finalPrice = estimatedPrice;
    if (premiumExperience) {
      finalPrice = Math.round(estimatedPrice * premiumExperience.price_multiplier);
    }

    const requestData = {
      passenger_name: user.full_name || user.email.split('@')[0],
      passenger_email: user.email,
      pickup_location: formData.pickup_location,
      dropoff_location: formData.dropoff_location,
      pickup_coords: pickupCoords,
      dropoff_coords: dropoffCoords,
      pickup_time: formData.pickup_time,
      passengers: parseInt(formData.passengers),
      estimated_price: finalPrice,
      surge_multiplier: surgeMultiplier,
      notes: formData.notes,
      status: 'pending',
      is_scheduled: formData.is_scheduled,
      scheduled_date: formData.scheduled_date ? format(formData.scheduled_date, 'yyyy-MM-dd') : null,
      scheduled_time: formData.scheduled_time || null
    };

    requestMutation.mutate(requestData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request a Ride</h1>
          <p className="text-gray-600">Get picked up in minutes</p>
        </motion.div>

        {/* Surge Pricing Map */}
        <div className="mb-8">
          <SurgePricingMap />
        </div>

        <div className="max-w-2xl mx-auto">

        {/* Holographic Preview - NEW */}
        <HolographicRidePreview 
          pickup={formData.pickup_location} 
          dropoff={formData.dropoff_location} 
        />

        {/* Favorite Locations */}
        {user && (
          <div className="mb-6">
            <FavoriteLocations
              userEmail={user.email}
              onSelectLocation={(location) => {
                setFormData(prev => ({
                  ...prev,
                  pickup_location: location.address
                }));
              }}
            />
          </div>
        )}

        {/* AI-Powered Features */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <SurgePredictionCard zone={formData.pickup_location || 'Downtown'} />
            <PreferenceLearningEngine userEmail={user.email} />
            <DestinationClusterAnalysis userEmail={user.email} />
          </div>
        )}

        {/* Proactive AI Assistant */}
        {user && (
          <>
            <PredictiveRideBooking userEmail={user.email} />
            <ProactiveRideAssistant userEmail={user.email} />
            <MoodBasedCustomization userEmail={user.email} />
            <SmartDestinationSuggestions 
              userEmail={user.email}
              onSelectDestination={(address) => {
                setFormData(prev => ({
                  ...prev,
                  dropoff_location: address
                }));
              }}
            />
          </>
        )}

        {/* Voice Assistant */}
        {user && (
          <VoiceRideAssistant
            userEmail={user.email}
            onRideBooked={(data) => {
              setFormData(prev => ({
                ...prev,
                pickup_location: data.pickup,
                dropoff_location: data.dropoff
              }));
            }}
          />
        )}

        {/* Autonomous Vehicles */}
        <AutonomousVehicleSelector />

        {/* Event Recommendations */}
        {user && formData.pickup_location && (
          <EventRideRecommendations userLocation={formData.pickup_location} />
        )}

        {/* AI Recommendations */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <RideRecommendations
              userEmail={user.email}
              onSelectRoute={(route) => {
                setFormData(prev => ({
                  ...prev,
                  pickup_location: route.pickup,
                  dropoff_location: route.dropoff
                }));
              }}
            />
          </motion.div>
        )}

        {/* Smart Wait for Surge */}
        {surgeMultiplier > 1.0 && formData.pickup_location && formData.dropoff_location && (
          <div className="mb-6">
            <SmartWaitNotifier
              pickupLocation={formData.pickup_location}
              dropoffLocation={formData.dropoff_location}
              currentSurge={surgeMultiplier}
            />
          </div>
        )}

        {/* Dynamic Pricing Intelligence */}
        {formData.pickup_location && (
          <DynamicPricingInsights location={formData.pickup_location} />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-xl border-0">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Locations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Where to?
                  </h3>
                  
                  <div>
                    <Label className="text-gray-700">Pickup Location *</Label>
                    <Select 
                      value={formData.pickup_location}
                      onValueChange={(value) => setFormData({...formData, pickup_location: value})}
                    >
                      <SelectTrigger className="h-12 mt-1.5 rounded-xl">
                        <SelectValue placeholder="Select pickup location" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(CITY_COORDS).map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-700">Drop-off Location *</Label>
                    <Select 
                      value={formData.dropoff_location}
                      onValueChange={(value) => setFormData({...formData, dropoff_location: value})}
                    >
                      <SelectTrigger className="h-12 mt-1.5 rounded-xl">
                        <SelectValue placeholder="Select drop-off location" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(CITY_COORDS).map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Time & Passengers */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    When & Who
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, is_scheduled: false})}
                      className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                        !formData.is_scheduled 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Now
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, is_scheduled: true})}
                      className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                        formData.is_scheduled 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Schedule
                    </button>
                  </div>

                  {formData.is_scheduled ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700">Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full h-12 mt-1.5 rounded-xl justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.scheduled_date ? format(formData.scheduled_date, 'PPP') : 'Pick date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.scheduled_date}
                              onSelect={(date) => setFormData({...formData, scheduled_date: date})}
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label className="text-gray-700">Time</Label>
                        <Input
                          type="time"
                          value={formData.scheduled_time}
                          onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                          className="h-12 mt-1.5 rounded-xl"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700">Pickup Time</Label>
                        <Select 
                          value={formData.pickup_time}
                          onValueChange={(value) => setFormData({...formData, pickup_time: value})}
                        >
                          <SelectTrigger className="h-12 mt-1.5 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="now">Now</SelectItem>
                            <SelectItem value="15min">In 15 minutes</SelectItem>
                            <SelectItem value="30min">In 30 minutes</SelectItem>
                            <SelectItem value="1hour">In 1 hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-gray-700">Passengers</Label>
                    <Select 
                      value={formData.passengers}
                      onValueChange={(value) => setFormData({...formData, passengers: value})}
                    >
                      <SelectTrigger className="h-12 mt-1.5 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n} {n === 1 ? 'passenger' : 'passengers'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label className="text-gray-700">Special Instructions (optional)</Label>
                  <Textarea
                    placeholder="Any special requests or instructions for the driver..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="mt-1.5 rounded-xl resize-none"
                    rows={3}
                  />
                </div>

                {/* Ride Pool Option */}
                {estimatedPrice && (
                  <RidePoolOption
                    estimatedPrice={estimatedPrice}
                    isEnabled={poolEnabled}
                    onToggle={() => setPoolEnabled(!poolEnabled)}
                  />
                )}

                {/* Accessibility Options */}
                <AccessibilityOptions
                  onSave={(data) => setAccessibilityNeeds(data.needs)}
                  initialNeeds={accessibilityNeeds}
                />

                {/* Eco Vehicle Matching */}
                <EcoVehicleMatch
                  enabled={ecoEnabled}
                  onToggle={setEcoEnabled}
                />

                {/* Pet Ride Options */}
                <PetRideOptions
                  enabled={petRide}
                  onToggle={setPetRide}
                  petConfig={petConfig}
                  setPetConfig={setPetConfig}
                />

                {/* Premium Experience */}
                <PremiumExperienceSelector
                  onSelect={setPremiumExperience}
                  selectedExperience={premiumExperience}
                />

                {/* Trip Planner */}
                {user && <TripPlanner userEmail={user.email} />}

                {/* Social Ride Matching */}
                {user && formData.pickup_location && formData.dropoff_location && (
                  <RideMatchmaking
                    userEmail={user.email}
                    route={`${formData.pickup_location} to ${formData.dropoff_location}`}
                  />
                )}

                {/* Group Ride */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowGroupRide(!showGroupRide)}
                    className="w-full rounded-xl"
                  >
                    👥 Organize Group Ride
                  </Button>
                  {showGroupRide && user && formData.pickup_location && formData.dropoff_location && (
                    <GroupRideCoordinator
                      userEmail={user.email}
                      pickup={formData.pickup_location}
                      dropoff={formData.dropoff_location}
                      onCreated={() => setShowGroupRide(false)}
                    />
                  )}
                </div>

                {/* Weather & Traffic Alerts */}
                {formData.pickup_location && (
                  <>
                    <WeatherAwareRouting location={formData.pickup_location} />
                    <WeatherVehicleMatch location={formData.pickup_location} />
                    <LiveTrafficUpdates location={formData.pickup_location} />
                  </>
                )}

                {/* Transit Comparison */}
                {formData.pickup_location && formData.dropoff_location && (
                  <TransitComparison
                    pickup={formData.pickup_location}
                    dropoff={formData.dropoff_location}
                  />
                )}

                {/* Price Forecast */}
                {formData.pickup_location && formData.dropoff_location && (
                  <PriceForecast
                    pickup={formData.pickup_location}
                    dropoff={formData.dropoff_location}
                  />
                )}

                {/* Route Optimization */}
                {formData.pickup_location && formData.dropoff_location && (
                  <div className="space-y-4">
                    <RouteOptimizationEngine
                      pickup={formData.pickup_location}
                      dropoff={formData.dropoff_location}
                    />
                    <SmartETAPredictor
                      pickup={formData.pickup_location}
                      dropoff={formData.dropoff_location}
                    />
                    <QuantumRouteOptimizer
                      pickup={formData.pickup_location}
                      dropoff={formData.dropoff_location}
                    />
                    <OptimizedRoute
                      pickup={{ 
                        address: formData.pickup_location, 
                        coords: CITY_COORDS[formData.pickup_location] 
                      }}
                      dropoff={{ 
                        address: formData.dropoff_location, 
                        coords: CITY_COORDS[formData.dropoff_location] 
                      }}
                      scheduledDateTime={
                        formData.is_scheduled && formData.scheduled_date && formData.scheduled_time
                          ? `${format(formData.scheduled_date, 'yyyy-MM-dd')} ${formData.scheduled_time}`
                          : null
                      }
                    />
                    <RiskAssessmentDisplay
                      route={{
                        pickup_location: formData.pickup_location,
                        dropoff_location: formData.dropoff_location
                      }}
                    />
                  </div>
                )}

                {/* Price Estimate */}
                {estimatedPrice && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-gradient-to-br rounded-2xl p-6 border-2 ${
                      surgeMultiplier > 1.0 
                        ? 'from-orange-50 to-red-50 border-orange-200' 
                        : 'from-indigo-50 to-purple-50 border-indigo-100'
                    }`}
                  >
                    {surgeMultiplier > 1.0 && (
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-orange-200">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-semibold text-orange-800">
                          High Demand - {surgeMultiplier}x surge pricing
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          surgeMultiplier > 1.0 ? 'bg-orange-600' : 'bg-indigo-600'
                        }`}>
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Estimated Fare</p>
                          {promoData ? (
                            <>
                              <p className="text-2xl font-bold text-gray-900 line-through">${estimatedPrice}</p>
                              <p className="text-3xl font-bold text-green-600">${promoData.finalPrice.toFixed(2)}</p>
                              <p className="text-xs text-green-600">You save ${promoData.discount.toFixed(2)}!</p>
                            </>
                          ) : (
                            <>
                              <p className="text-3xl font-bold text-gray-900">${estimatedPrice}</p>
                              {surgeMultiplier > 1.0 && (
                                <p className="text-xs text-gray-500 line-through">
                                  ${Math.round(estimatedPrice / surgeMultiplier)} base fare
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Final price may vary</p>
                        <p className="text-xs text-gray-500">based on actual route</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <Button 
                  type="submit"
                  disabled={requestMutation.isPending || !estimatedPrice}
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-base shadow-lg shadow-indigo-200"
                >
                  {requestMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Requesting Ride...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Request Ride
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </div>
    </div>
  );
}