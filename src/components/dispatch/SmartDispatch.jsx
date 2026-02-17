import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Calculate distance between two coordinates
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

export default function SmartDispatch({ onRideAssigned }) {
  const queryClient = useQueryClient();

  // Fetch pending requests
  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['allPendingRequests'],
    queryFn: () => base44.entities.RideRequest.filter({ status: 'pending' }),
    refetchInterval: 5000
  });

  // Fetch all active drivers (those with profiles and approved)
  const { data: allDriverProfiles = [] } = useQuery({
    queryKey: ['activeDrivers'],
    queryFn: () => base44.entities.DriverProfile.filter({ onboarding_status: 'approved' })
  });

  // Fetch driver performance data
  const { data: driverPerformance = [] } = useQuery({
    queryKey: ['driverPerformance'],
    queryFn: () => base44.entities.DriverPerformance.list()
  });

  // Fetch driver reviews for ratings
  const { data: allReviews = [] } = useQuery({
    queryKey: ['allReviews'],
    queryFn: () => base44.entities.Review.list()
  });

  // Send proactive notifications to nearby drivers
  const notifyNearbyDriversMutation = useMutation({
    mutationFn: async ({ drivers, request }) => {
      for (const driver of drivers.slice(0, 3)) { // Top 3 drivers
        await base44.integrations.Core.SendEmail({
          to: driver.driver_email,
          subject: '🚀 Ride Opportunity Nearby - Walla',
          body: `Hi ${driver.full_name},

A high-value ride opportunity is available near you!

📍 Pickup: ${request.pickup_location}
🎯 Dropoff: ${request.dropoff_location}
💰 Fare: $${request.estimated_price}
⏱️ ETA to Pickup: ${Math.round(driver.eta * 60)} min

This ride was matched to you based on your location, rating, and performance.

Open the app now to accept this ride!

Best regards,
Walla Dispatch AI`
        });
      }
    }
  });

  const assignRideMutation = useMutation({
    mutationFn: async ({ request, driver, score }) => {
      const vehicleInfo = `${driver.vehicle_make} ${driver.vehicle_model} - ${driver.vehicle_color}`;
      
      await base44.entities.RideRequest.update(request.id, {
        status: 'accepted',
        driver_email: driver.driver_email,
        driver_name: driver.full_name,
        vehicle_info: vehicleInfo
      });

      // Send notification to assigned driver
      await base44.integrations.Core.SendEmail({
        to: driver.driver_email,
        subject: '✅ Ride Assigned - Walla Smart Dispatch',
        body: `Hi ${driver.full_name},

🎉 A ride has been automatically assigned to you based on AI optimization!

📍 Pickup: ${request.pickup_location}
🎯 Dropoff: ${request.dropoff_location}
👤 Passenger: ${request.passenger_name}
💰 Fare: $${request.estimated_price}
⭐ Match Score: ${score}/100

This ride was optimally matched to maximize your earnings and minimize idle time.

Open the app to start navigation.

Best regards,
Walla Smart Dispatch`
      });

      return { request, driver };
    },
    onSuccess: ({ request, driver }) => {
      queryClient.invalidateQueries(['allPendingRequests']);
      queryClient.invalidateQueries(['myActiveRequests']);
      toast.success(`Ride assigned to ${driver.full_name}`);
      if (onRideAssigned) onRideAssigned(request, driver);
    }
  });

  // AI-powered dispatch logic with proactive notifications
  useEffect(() => {
    if (pendingRequests.length === 0 || allDriverProfiles.length === 0) return;

    const dispatchRides = async () => {
      for (const request of pendingRequests) {
        const requestAge = Date.now() - new Date(request.created_date).getTime();
        
        // Find best drivers using AI algorithm
        const scoredDrivers = await findBestDrivers(request, allDriverProfiles);
        
        if (scoredDrivers.length > 0) {
          // Send proactive notifications after 10 seconds
          if (requestAge > 10000 && requestAge < 15000) {
            notifyNearbyDriversMutation.mutate({ 
              drivers: scoredDrivers.slice(0, 3), 
              request 
            });
          }
          
          // Auto-assign to best driver after 30 seconds if no manual acceptance
          if (requestAge > 30000) {
            const bestMatch = scoredDrivers[0];
            assignRideMutation.mutate({ 
              request, 
              driver: bestMatch.driver,
              score: Math.round(bestMatch.score)
            });
          }
        }
      }
    };

    const interval = setInterval(dispatchRides, 5000);
    return () => clearInterval(interval);
  }, [pendingRequests, allDriverProfiles]);

  const findBestDrivers = async (request, drivers) => {
    // Score each driver with enhanced AI algorithm
    const scoredDrivers = drivers.map(driver => {
      // Calculate distance (proximity score)
      const distance = calculateDistance(
        request.pickup_coords.latitude,
        request.pickup_coords.longitude,
        37.7749, // Simulate driver location (would be real-time in production)
        -122.4194
      );
      const proximityScore = Math.max(0, 100 - distance * 10);

      // Get driver rating
      const driverReviews = allReviews.filter(r => r.reviewee_email === driver.driver_email);
      const avgRating = driverReviews.length > 0
        ? driverReviews.reduce((sum, r) => sum + r.rating, 0) / driverReviews.length
        : 5;
      const ratingScore = (avgRating / 5) * 100;

      // Get performance metrics
      const performance = driverPerformance.find(p => p.driver_email === driver.driver_email);
      const acceptanceRate = performance?.acceptance_rate || 100;
      const efficiencyScore = performance?.efficiency_score || 100;
      const onTimePercentage = performance?.on_time_percentage || 100;

      // Calculate ETA (estimated time of arrival) with predictive model
      const baseETA = distance / 40; // Base: 40 km/h average speed
      const trafficFactor = 1.2; // Simulate traffic impact
      const predictedETA = baseETA * trafficFactor;
      const etaScore = Math.max(0, 100 - predictedETA * 15);

      // Calculate idle time reduction (drivers closer = less idle time)
      const idleTimeScore = proximityScore; // Closer drivers have less idle time

      // Weighted scoring for optimal allocation
      const totalScore = 
        proximityScore * 0.35 +      // Proximity to pickup
        ratingScore * 0.15 +          // Driver rating
        acceptanceRate * 0.15 +       // Acceptance rate
        efficiencyScore * 0.15 +      // Efficiency
        etaScore * 0.10 +             // Predicted ETA
        onTimePercentage * 0.10;      // On-time performance

      return { 
        driver, 
        score: totalScore, 
        distance, 
        eta: predictedETA,
        metrics: {
          proximity: proximityScore,
          rating: ratingScore,
          acceptance: acceptanceRate,
          efficiency: efficiencyScore,
          eta: etaScore
        }
      };
    });

    // Sort by score (best matches first)
    scoredDrivers.sort((a, b) => b.score - a.score);
    return scoredDrivers;
  };

  return null; // This is a background service component
}