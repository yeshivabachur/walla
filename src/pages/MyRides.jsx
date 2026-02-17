import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  MapPin, Clock, Users, Loader2, ArrowRight, AlertCircle, 
  CheckCircle, Star, Navigation, DollarSign, Eye, Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import EmptyState from '@/components/rides/EmptyState';
import ReviewModal from '@/components/reviews/ReviewModal';
import RatingDisplay from '@/components/reviews/RatingDisplay';
import PassengerStats from '@/components/rides/PassengerStats';
import RideDetailView from '@/components/rides/RideDetailView';
import TipDriver from '@/components/payment/TipDriver';
import SplitFare from '@/components/payment/SplitFare';
import CarbonTracker from '@/components/environmental/CarbonTracker';
import LostAndFound from '@/components/support/LostAndFound';
import ReferralProgram from '@/components/referral/ReferralProgram';
import DigitalWallet from '@/components/wallet/DigitalWallet';
import CarbonOffsetProgram from '@/components/environmental/CarbonOffsetProgram';
import VIPMembershipCard from '@/components/vip/VIPMembershipCard';
import RideStreakTracker from '@/components/streaks/RideStreakTracker';
import FriendsList from '@/components/social/FriendsList';
import ExpenseTracker from '@/components/business/ExpenseTracker';
import WellnessRideMode from '@/components/wellness/WellnessRideMode';
import RideChallenges from '@/components/challenges/RideChallenges';
import EmergencyContactManager from '@/components/safety/EmergencyContactManager';
import AutoTipSettings from '@/components/tips/AutoTipSettings';
import RideCreditsDisplay from '@/components/credits/RideCreditsDisplay';
import PassengerInsights from '@/components/analytics/PassengerInsights';
import SurgeProtectionSettings from '@/components/pricing/SurgeProtectionSettings';
import PassengerJourneyAnalytics from '@/components/analytics/PassengerJourneyAnalytics';
import SmartRebooking from '@/components/passenger/SmartRebooking';
import PassengerSavingsTracker from '@/components/analytics/PassengerSavingsTracker';
import PersonalizedRecommendations from '@/components/passenger/PersonalizedRecommendations';
import RewardMilestones from '@/components/rewards/RewardMilestones';
import RidePatternAnalysis from '@/components/analytics/RidePatternAnalysis';
import StreakBonusTracker from '@/components/gamification/StreakBonusTracker';
import CustomerRetentionInsights from '@/components/retention/CustomerRetentionInsights';
import WeeklyReportCard from '@/components/reports/WeeklyReportCard';
import CommunityEventsHub from '@/components/community/CommunityEventsHub';
import SentimentAnalysis from '@/components/analytics/SentimentAnalysis';
import CommunityFeed from '@/components/community/CommunityFeed';
import LoyaltyTierCard from '@/components/loyalty/LoyaltyTierCard';
import SocialImpactTracker from '@/components/social/SocialImpactTracker';
import ARNavigationToggle from '@/components/ar/ARNavigationToggle';
import CryptoPaymentOption from '@/components/crypto/CryptoPaymentOption';
import GlobalLeaderboard from '@/components/gamification/GlobalLeaderboard';
import PersonalAIAssistant from '@/components/ai/PersonalAIAssistant';
import HealthMonitoringCard from '@/components/health/HealthMonitoringCard';
import LoyaltyRewardsShop from '@/components/rewards/LoyaltyRewardsShop';
import AchievementTracker from '@/components/gamification/AchievementTracker';
import RideAnalyticsDashboard from '@/components/analytics/RideAnalyticsDashboard';
import PassengerSafetyCard from '@/components/safety/PassengerSafetyCard';
import PersonalizedPricingCard from '@/components/pricing/PersonalizedPricingCard';
import RideBundleShop from '@/components/bundles/RideBundleShop';
import ComfortPreferences from '@/components/comfort/ComfortPreferences';
import RideStoryRecap from '@/components/ui/RideStoryRecap';

export default function MyRides() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cancelRequest, setCancelRequest] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showTipModal, setShowTipModal] = useState(null);
  const [showSplitModal, setShowSplitModal] = useState(null);
  const ridesPerPage = 10;
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

  // Fetch my ride requests
  const { data: myRequests = [], isLoading } = useQuery({
    queryKey: ['myRequests', user?.email],
    queryFn: () => base44.entities.RideRequest.filter({ passenger_email: user.email }, '-created_date'),
    enabled: !!user
  });

  // Fetch reviews
  const { data: allReviews = [] } = useQuery({
    queryKey: ['allReviews'],
    queryFn: () => base44.entities.Review.list()
  });

  const hasReviewed = (requestId, driverEmail) => {
    return allReviews.some(
      r => r.ride_id === requestId && r.reviewer_email === user?.email && r.reviewee_email === driverEmail
    );
  };

  const getDriverRating = (driverEmail) => {
    const driverReviews = allReviews.filter(
      r => r.reviewee_email === driverEmail && r.reviewer_type === 'passenger'
    );
    if (driverReviews.length === 0) return null;
    const avgRating = driverReviews.reduce((sum, r) => sum + r.rating, 0) / driverReviews.length;
    return { rating: avgRating, count: driverReviews.length };
  };

  const isFavorited = (driverEmail) => {
    return user?.favorite_driver_emails?.includes(driverEmail) || false;
  };

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

  const rebookRide = (request) => {
    navigate(createPageUrl('RequestRide'), {
      state: {
        pickup_location: request.pickup_location,
        dropoff_location: request.dropoff_location,
        passengers: request.passengers
      }
    });
  };

  const cancelRequestMutation = useMutation({
    mutationFn: async (requestId) => {
      await base44.entities.RideRequest.update(requestId, { status: 'cancelled' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myRequests']);
      setCancelRequest(null);
      toast.success('Ride cancelled');
    }
  });

  const handleReview = (request) => {
    setReviewTarget({
      requestId: request.id,
      driverEmail: request.driver_email,
      driverName: request.driver_name
    });
    setReviewModalOpen(true);
  };

  const submitReview = async ({ rating, comment }) => {
    setIsSubmittingReview(true);
    
    await base44.entities.Review.create({
      reviewer_email: user.email,
      reviewee_email: reviewTarget.driverEmail,
      ride_id: reviewTarget.requestId,
      rating,
      comment,
      reviewer_type: 'passenger'
    });

    queryClient.invalidateQueries(['allReviews']);
    setIsSubmittingReview(false);
    setReviewModalOpen(false);
    toast.success('Review submitted successfully!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view your rides</p>
        </div>
      </div>
    );
  }

  const activeRequests = myRequests.filter(r => ['pending', 'accepted', 'in_progress'].includes(r.status));
  const allCompletedRequests = myRequests.filter(r => r.status === 'completed');

  // Filter completed requests based on search query
  const filteredCompletedRequests = useMemo(() => {
    if (!searchQuery.trim()) return allCompletedRequests;

    const query = searchQuery.toLowerCase();
    return allCompletedRequests.filter(request => {
      const matchesLocation = 
        request.pickup_location?.toLowerCase().includes(query) ||
        request.dropoff_location?.toLowerCase().includes(query);
      const matchesDriver = request.driver_name?.toLowerCase().includes(query);
      const matchesDate = new Date(request.created_date).toLocaleDateString().includes(query);
      
      return matchesLocation || matchesDriver || matchesDate;
    });
  }, [allCompletedRequests, searchQuery]);

  // Paginate filtered results
  const totalPages = Math.ceil(filteredCompletedRequests.length / ridesPerPage);
  const startIndex = (currentPage - 1) * ridesPerPage;
  const paginatedRequests = filteredCompletedRequests.slice(startIndex, startIndex + ridesPerPage);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Finding Driver' },
    accepted: { color: 'bg-blue-100 text-blue-800', label: 'Driver Assigned' },
    in_progress: { color: 'bg-green-100 text-green-800', label: 'In Progress' },
    completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
  };

  if (selectedRide) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedRide(null)}
            className="mb-6"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to All Rides
          </Button>
          <RideDetailView
            request={selectedRide}
            onRebook={() => rebookRide(selectedRide)}
            onFavorite={(email) => toggleFavoriteMutation.mutate(email)}
            isFavorited={isFavorited(selectedRide.driver_email)}
            driverRating={getDriverRating(selectedRide.driver_email)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Rides</h1>

        {/* Top Row - Carbon, Referral & Wallet */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CarbonTracker userEmail={user.email} />
            <ReferralProgram userEmail={user.email} />
          </div>
        )}

        {/* Second Row - Wallet, Offset, VIP, Loyalty, Pricing */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <DigitalWallet userEmail={user.email} />
            <CarbonOffsetProgram userEmail={user.email} />
            <VIPMembershipCard userEmail={user.email} />
            <LoyaltyTierCard userEmail={user.email} />
            <PersonalizedPricingCard userEmail={user.email} />
          </div>
        )}

        {/* Third Row - Streak, Social, Business, Credits, Impact, Safety */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-6">
            <RideStreakTracker userEmail={user.email} />
            <FriendsList userEmail={user.email} />
            <ExpenseTracker userEmail={user.email} />
            <RideCreditsDisplay userEmail={user.email} />
            <SocialImpactTracker userEmail={user.email} />
            <PassengerSafetyCard userEmail={user.email} />
          </div>
        )}

        {/* Wellness Mode & Challenges */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <WellnessRideMode userEmail={user.email} />
          </div>
        )}

        {/* Ride Challenges & Streak Bonuses */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RideChallenges userEmail={user.email} />
            <StreakBonusTracker userEmail={user.email} />
          </div>
        )}

        {/* AR, Crypto, AI, Health, Bundles & Comfort */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-6">
            <ARNavigationToggle userEmail={user.email} />
            <CryptoPaymentOption userEmail={user.email} />
            <PersonalAIAssistant userEmail={user.email} />
            <HealthMonitoringCard userEmail={user.email} />
            <RideBundleShop userEmail={user.email} />
            <ComfortPreferences userEmail={user.email} />
          </div>
        )}

        {/* Leaderboard */}
        {user && <GlobalLeaderboard userEmail={user.email} />}

        {/* Emergency Contacts, Auto-Tip & Surge Protection */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <EmergencyContactManager userEmail={user.email} />
            <AutoTipSettings userEmail={user.email} />
            <SurgeProtectionSettings userEmail={user.email} />
          </div>
        )}

        {/* Lost & Found & Community */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <LostAndFound userEmail={user.email} userType="passenger" />
            <CommunityFeed />
          </div>
        )}

        {/* Achievements */}
        {user && (
          <AchievementTracker userEmail={user.email} />
        )}

        {/* Analytics Dashboard */}
        {user && allCompletedRequests.length >= 5 && (
          <RideAnalyticsDashboard userEmail={user.email} />
        )}

        {/* Loyalty Rewards Shop */}
        {user && (
          <LoyaltyRewardsShop userEmail={user.email} />
        )}

        {/* Passenger Journey Analytics */}
        {user && allCompletedRequests.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <PassengerJourneyAnalytics userEmail={user.email} />
              <PassengerSavingsTracker userEmail={user.email} />
              <PersonalizedRecommendations userEmail={user.email} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <RewardMilestones userEmail={user.email} />
              <RidePatternAnalysis userEmail={user.email} />
              <CustomerRetentionInsights userEmail={user.email} />
            </div>
          </>
        )}

        {/* Weekly Report & Community */}
        {user && allCompletedRequests.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <WeeklyReportCard userEmail={user.email} userType="passenger" />
            <CommunityEventsHub userEmail={user.email} />
          </div>
        )}

        {/* Sentiment Analysis */}
        {user && allCompletedRequests.length >= 3 && (
          <div className="mb-6">
            <SentimentAnalysis userEmail={user.email} />
          </div>
        )}

        {/* Passenger Insights */}
        {user && allCompletedRequests.length > 0 && (
          <PassengerInsights userEmail={user.email} />
        )}

        {/* Passenger Statistics */}
        {allCompletedRequests.length > 0 && (
          <PassengerStats requests={myRequests} />
        )}

        {/* Active Rides */}
        {activeRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active</h2>
            <div className="space-y-4">
              <AnimatePresence>
                {activeRequests.map((request, index) => {
                  const status = statusConfig[request.status];
                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-lg">{request.pickup_location}</span>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold text-lg">{request.dropoff_location}</span>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="secondary" className="bg-gray-100">
                                  <Users className="w-3 h-3 mr-1" />
                                  {request.passengers} passenger{request.passengers > 1 ? 's' : ''}
                                </Badge>
                                <Badge variant="secondary" className="bg-gray-100">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  ${request.estimated_price}
                                </Badge>
                              </div>
                            </div>
                            <Badge className={status.color}>
                              {status.label}
                            </Badge>
                          </div>

                          {request.driver_name && (
                            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                {request.driver_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="text-sm text-gray-600">Driver: {request.driver_name}</span>
                                {request.vehicle_info && (
                                  <p className="text-xs text-gray-500">{request.vehicle_info}</p>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            <Link to={createPageUrl(`TrackRequest?id=${request.id}`)}>
                              <Button variant="default" size="sm" className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Navigation className="w-4 h-4 mr-1" />
                                Track Ride
                              </Button>
                            </Link>
                            {request.status === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setCancelRequest(request)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Completed Rides */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">History</h2>
            {allCompletedRequests.length > 0 && (
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by location, driver, or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 h-9 rounded-lg"
                />
              </div>
            )}
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
            ) : filteredCompletedRequests.length > 0 ? (
            <>
              <div className="space-y-4">
                <AnimatePresence>
                  {paginatedRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {index === 0 && user && (
                      <div className="mb-4">
                        <SmartRebooking pastRide={request} />
                      </div>
                    )}
                    <Card className="overflow-hidden border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{request.pickup_location}</span>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold">{request.dropoff_location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                              <span>${request.estimated_price}</span>
                              <span>•</span>
                              <span>{request.driver_name}</span>
                            </div>
                          </div>
                          <Badge className="bg-gray-100 text-gray-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <RideStoryRecap rideRequest={request} />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg"
                            onClick={() => setSelectedRide(request)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg"
                            onClick={() => rebookRide(request)}
                          >
                            <ArrowRight className="w-4 h-4 mr-1" />
                            Rebook
                          </Button>
                          {request.driver_email && !hasReviewed(request.id, request.driver_email) && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200"
                              onClick={() => handleReview(request)}
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Rate
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg"
                            onClick={() => setShowTipModal(request)}
                          >
                            💝 Tip
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg"
                            onClick={() => setShowSplitModal(request)}
                          >
                            👥 Split
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                </AnimatePresence>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                </div>
                )}
                </>
                ) : searchQuery ? (
                <EmptyState 
                title="No rides found" 
                description={`No rides match "${searchQuery}"`}
                />
                ) : (
            <EmptyState 
              title="No ride history" 
              description="Your completed rides will appear here"
            />
          )}
        </div>

        {/* Cancel Dialog */}
        <Dialog open={!!cancelRequest} onOpenChange={() => setCancelRequest(null)}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Cancel Ride?</DialogTitle>
            </DialogHeader>
            <p className="text-gray-600">
              Are you sure you want to cancel this ride request?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelRequest(null)} className="rounded-xl">
                Keep Ride
              </Button>
              <Button 
                variant="destructive"
                onClick={() => cancelRequestMutation.mutate(cancelRequest?.id)}
                disabled={cancelRequestMutation.isPending}
                className="rounded-xl"
              >
                {cancelRequestMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Cancel Ride
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Review Modal */}
        {reviewTarget && (
          <ReviewModal
            isOpen={reviewModalOpen}
            onClose={() => {
              setReviewModalOpen(false);
              setReviewTarget(null);
            }}
            onSubmit={submitReview}
            revieweeEmail={reviewTarget.driverEmail}
            revieweeName={reviewTarget.driverName}
            reviewerType="driver"
            isSubmitting={isSubmittingReview}
          />
        )}

        {/* Tip Modal */}
        {showTipModal && (
          <Dialog open={!!showTipModal} onOpenChange={() => setShowTipModal(null)}>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <TipDriver 
                rideRequest={showTipModal} 
                onTipSubmitted={() => setShowTipModal(null)}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Split Fare Modal */}
        {showSplitModal && (
          <Dialog open={!!showSplitModal} onOpenChange={() => setShowSplitModal(null)}>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <SplitFare 
                rideRequest={showSplitModal}
                userEmail={user?.email}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}