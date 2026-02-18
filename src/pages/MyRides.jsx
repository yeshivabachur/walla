import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Loader2, ArrowRight, AlertCircle, 
  CheckCircle, Star, Navigation, DollarSign, Eye, Search, 
  ChevronLeft, ChevronRight, Car, Trophy, BarChart2, Users2, Settings
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import EmptyState from '@/components/rides/EmptyState';
import ReviewModal from '@/components/reviews/ReviewModal';
import PassengerStats from '@/components/rides/PassengerStats';
import RideDetailView from '@/components/rides/RideDetailView';
import TipDriver from '@/components/payment/TipDriver';
import SplitFare from '@/components/payment/SplitFare';
import SmartRebooking from '@/components/passenger/SmartRebooking';

// Rewards tab
import DigitalWallet from '@/components/wallet/DigitalWallet';
import VIPMembershipCard from '@/components/vip/VIPMembershipCard';
import LoyaltyTierCard from '@/components/loyalty/LoyaltyTierCard';
import RideCreditsDisplay from '@/components/credits/RideCreditsDisplay';
import RideStreakTracker from '@/components/streaks/RideStreakTracker';
import AchievementTracker from '@/components/gamification/AchievementTracker';
import LoyaltyRewardsShop from '@/components/rewards/LoyaltyRewardsShop';
import RewardMilestones from '@/components/rewards/RewardMilestones';
import StreakBonusTracker from '@/components/gamification/StreakBonusTracker';
import ReferralProgram from '@/components/referral/ReferralProgram';
import PersonalizedPricingCard from '@/components/pricing/PersonalizedPricingCard';

// Analytics tab
import PassengerInsights from '@/components/analytics/PassengerInsights';
import PassengerJourneyAnalytics from '@/components/analytics/PassengerJourneyAnalytics';
import PassengerSavingsTracker from '@/components/analytics/PassengerSavingsTracker';
import RidePatternAnalysis from '@/components/analytics/RidePatternAnalysis';
import SentimentAnalysis from '@/components/analytics/SentimentAnalysis';
import WeeklyReportCard from '@/components/reports/WeeklyReportCard';
import RideAnalyticsDashboard from '@/components/analytics/RideAnalyticsDashboard';
import PersonalizedRecommendations from '@/components/passenger/PersonalizedRecommendations';
import CustomerRetentionInsights from '@/components/retention/CustomerRetentionInsights';

// Community tab
import FriendsList from '@/components/social/FriendsList';
import CommunityFeed from '@/components/community/CommunityFeed';
import CommunityEventsHub from '@/components/community/CommunityEventsHub';
import GlobalLeaderboard from '@/components/gamification/GlobalLeaderboard';
import SocialImpactTracker from '@/components/social/SocialImpactTracker';
import CarbonTracker from '@/components/environmental/CarbonTracker';
import CarbonOffsetProgram from '@/components/environmental/CarbonOffsetProgram';

// Settings tab
import EmergencyContactManager from '@/components/safety/EmergencyContactManager';
import AutoTipSettings from '@/components/tips/AutoTipSettings';
import SurgeProtectionSettings from '@/components/pricing/SurgeProtectionSettings';
import WellnessRideMode from '@/components/wellness/WellnessRideMode';
import ComfortPreferences from '@/components/comfort/ComfortPreferences';
import RideChallenges from '@/components/challenges/RideChallenges';
import PassengerSafetyCard from '@/components/safety/PassengerSafetyCard';
import LostAndFound from '@/components/support/LostAndFound';
import ExpenseTracker from '@/components/business/ExpenseTracker';

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

  const { data: myRequests = [], isLoading } = useQuery({
    queryKey: ['myRequests', user?.email],
    queryFn: () => base44.entities.RideRequest.filter({ passenger_email: user.email }, '-created_date'),
    enabled: !!user
  });

  const { data: allReviews = [] } = useQuery({
    queryKey: ['allReviews'],
    queryFn: () => base44.entities.Review.list()
  });

  const hasReviewed = (requestId, driverEmail) =>
    allReviews.some(r => r.ride_id === requestId && r.reviewer_email === user?.email && r.reviewee_email === driverEmail);

  const getDriverRating = (driverEmail) => {
    const driverReviews = allReviews.filter(r => r.reviewee_email === driverEmail && r.reviewer_type === 'passenger');
    if (!driverReviews.length) return null;
    return { rating: driverReviews.reduce((s, r) => s + r.rating, 0) / driverReviews.length, count: driverReviews.length };
  };

  const isFavorited = (driverEmail) => user?.favorite_driver_emails?.includes(driverEmail) || false;

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (driverEmail) => {
      const favorites = user.favorite_driver_emails || [];
      const newFavorites = favorites.includes(driverEmail)
        ? favorites.filter(e => e !== driverEmail)
        : [...favorites, driverEmail];
      await base44.auth.updateMe({ favorite_driver_emails: newFavorites });
    },
    onSuccess: () => { queryClient.invalidateQueries(['currentUser']); toast.success('Favorites updated'); }
  });

  const rebookRide = (request) => navigate(createPageUrl('RequestRide'), {
    state: { pickup_location: request.pickup_location, dropoff_location: request.dropoff_location, passengers: request.passengers }
  });

  const cancelRequestMutation = useMutation({
    mutationFn: (requestId) => base44.entities.RideRequest.update(requestId, { status: 'cancelled' }),
    onSuccess: () => { queryClient.invalidateQueries(['myRequests']); setCancelRequest(null); toast.success('Ride cancelled'); }
  });

  const handleReview = (request) => {
    setReviewTarget({ requestId: request.id, driverEmail: request.driver_email, driverName: request.driver_name });
    setReviewModalOpen(true);
  };

  const submitReview = async ({ rating, comment }) => {
    setIsSubmittingReview(true);
    await base44.entities.Review.create({
      reviewer_email: user.email, reviewee_email: reviewTarget.driverEmail,
      ride_id: reviewTarget.requestId, rating, comment, reviewer_type: 'passenger'
    });
    queryClient.invalidateQueries(['allReviews']);
    setIsSubmittingReview(false);
    setReviewModalOpen(false);
    toast.success('Review submitted!');
  };

  const activeRequests = myRequests.filter(r => ['pending', 'accepted', 'in_progress'].includes(r.status));
  const allCompletedRequests = myRequests.filter(r => r.status === 'completed');

  const filteredCompletedRequests = useMemo(() => {
    if (!searchQuery.trim()) return allCompletedRequests;
    const q = searchQuery.toLowerCase();
    return allCompletedRequests.filter(r =>
      r.pickup_location?.toLowerCase().includes(q) ||
      r.dropoff_location?.toLowerCase().includes(q) ||
      r.driver_name?.toLowerCase().includes(q) ||
      new Date(r.created_date).toLocaleDateString().includes(q)
    );
  }, [allCompletedRequests, searchQuery]);

  const totalPages = Math.ceil(filteredCompletedRequests.length / ridesPerPage);
  const paginatedRequests = filteredCompletedRequests.slice((currentPage - 1) * ridesPerPage, currentPage * ridesPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Finding Driver' },
    accepted: { color: 'bg-blue-100 text-blue-800', label: 'Driver Assigned' },
    in_progress: { color: 'bg-green-100 text-green-800', label: 'In Progress' },
    completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
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

  if (selectedRide) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => setSelectedRide(null)} className="mb-6">
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Rides</h1>
          <Link to={createPageUrl('RequestRide')}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
              + Request Ride
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="rides" className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-6 rounded-xl h-12">
            <TabsTrigger value="rides" className="rounded-xl flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span className="hidden sm:inline">Rides</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="rounded-xl flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="rounded-xl flex items-center gap-2">
              <Users2 className="w-4 h-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* ── RIDES TAB ── */}
          <TabsContent value="rides" className="space-y-6">
            {allCompletedRequests.length > 0 && <PassengerStats requests={myRequests} />}

            {/* Active Rides */}
            {activeRequests.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Active</h2>
                <div className="space-y-3">
                  <AnimatePresence>
                    {activeRequests.map((request, index) => {
                      const status = statusConfig[request.status];
                      return (
                        <motion.div key={request.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                                    <span>{request.pickup_location}</span>
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                    <span>{request.dropoff_location}</span>
                                  </div>
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant="secondary" className="text-xs"><Users className="w-3 h-3 mr-1" />{request.passengers}p</Badge>
                                    <Badge variant="secondary" className="text-xs"><DollarSign className="w-3 h-3 mr-1" />${request.estimated_price}</Badge>
                                  </div>
                                </div>
                                <Badge className={status.color}>{status.label}</Badge>
                              </div>
                              {request.driver_name && (
                                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                    {request.driver_name.charAt(0).toUpperCase()}
                                  </div>
                                  {request.driver_name}
                                  {request.vehicle_info && <span className="text-gray-400 text-xs">· {request.vehicle_info}</span>}
                                </div>
                              )}
                              <div className="flex gap-2">
                                <Link to={createPageUrl(`TrackRequest?id=${request.id}`)}>
                                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                                    <Navigation className="w-4 h-4 mr-1" />Track
                                  </Button>
                                </Link>
                                {request.status === 'pending' && (
                                  <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 rounded-lg" onClick={() => setCancelRequest(request)}>Cancel</Button>
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

            {/* History */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">History</h2>
                {allCompletedRequests.length > 0 && (
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input placeholder="Search rides..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 w-56 h-9 rounded-lg" />
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
              ) : filteredCompletedRequests.length > 0 ? (
                <>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {paginatedRequests.map((request, index) => (
                        <motion.div key={request.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                          {index === 0 && <div className="mb-3"><SmartRebooking pastRide={request} /></div>}
                          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
                                    <span>{request.pickup_location}</span>
                                    <ArrowRight className="w-3 h-3 text-gray-400" />
                                    <span>{request.dropoff_location}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    {request.estimated_price && <span>${request.estimated_price}</span>}
                                    {request.driver_name && <><span>·</span><span>{request.driver_name}</span></>}
                                    <span>·</span>
                                    <span>{new Date(request.created_date).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <Badge className="bg-gray-100 text-gray-700 text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />Done
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" className="rounded-lg text-xs h-8" onClick={() => setSelectedRide(request)}>
                                  <Eye className="w-3 h-3 mr-1" />Details
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-lg text-xs h-8" onClick={() => rebookRide(request)}>
                                  <ArrowRight className="w-3 h-3 mr-1" />Rebook
                                </Button>
                                {request.driver_email && !hasReviewed(request.id, request.driver_email) && (
                                  <Button variant="outline" size="sm" className="rounded-lg text-xs h-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50" onClick={() => handleReview(request)}>
                                    <Star className="w-3 h-3 mr-1" />Rate
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" className="rounded-lg text-xs h-8" onClick={() => setShowTipModal(request)}>💝 Tip</Button>
                                <Button variant="outline" size="sm" className="rounded-lg text-xs h-8" onClick={() => setShowSplitModal(request)}>👥 Split</Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-6">
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded-lg"><ChevronLeft className="w-4 h-4" /></Button>
                      <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="rounded-lg"><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                  )}
                </>
              ) : searchQuery ? (
                <EmptyState title="No rides found" description={`No rides match "${searchQuery}"`} />
              ) : (
                <EmptyState title="No ride history" description="Your completed rides will appear here" />
              )}
            </div>
          </TabsContent>

          {/* ── REWARDS TAB ── */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DigitalWallet userEmail={user.email} />
              <PersonalizedPricingCard userEmail={user.email} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <VIPMembershipCard userEmail={user.email} />
              <LoyaltyTierCard userEmail={user.email} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RideCreditsDisplay userEmail={user.email} />
              <RideStreakTracker userEmail={user.email} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StreakBonusTracker userEmail={user.email} />
              <RewardMilestones userEmail={user.email} />
            </div>
            <AchievementTracker userEmail={user.email} />
            <LoyaltyRewardsShop userEmail={user.email} />
            <ReferralProgram userEmail={user.email} />
          </TabsContent>

          {/* ── ANALYTICS TAB ── */}
          <TabsContent value="analytics" className="space-y-6">
            {allCompletedRequests.length >= 5 && <RideAnalyticsDashboard userEmail={user.email} />}
            {allCompletedRequests.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PassengerSavingsTracker userEmail={user.email} />
                  <PersonalizedRecommendations userEmail={user.email} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PassengerJourneyAnalytics userEmail={user.email} />
                  <RidePatternAnalysis userEmail={user.email} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <WeeklyReportCard userEmail={user.email} userType="passenger" />
                  <CustomerRetentionInsights userEmail={user.email} />
                </div>
                {allCompletedRequests.length >= 3 && <SentimentAnalysis userEmail={user.email} />}
                <PassengerInsights userEmail={user.email} />
              </>
            ) : (
              <EmptyState title="No data yet" description="Complete some rides to unlock insights" />
            )}
          </TabsContent>

          {/* ── COMMUNITY TAB ── */}
          <TabsContent value="community" className="space-y-6">
            <GlobalLeaderboard userEmail={user.email} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FriendsList userEmail={user.email} />
              <SocialImpactTracker userEmail={user.email} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CarbonTracker userEmail={user.email} />
              <CarbonOffsetProgram userEmail={user.email} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CommunityFeed />
              <CommunityEventsHub userEmail={user.email} />
            </div>
          </TabsContent>

          {/* ── SETTINGS TAB ── */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PassengerSafetyCard userEmail={user.email} />
              <EmergencyContactManager userEmail={user.email} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AutoTipSettings userEmail={user.email} />
              <SurgeProtectionSettings userEmail={user.email} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <WellnessRideMode userEmail={user.email} />
              <ComfortPreferences userEmail={user.email} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RideChallenges userEmail={user.email} />
              <ExpenseTracker userEmail={user.email} />
            </div>
            <LostAndFound userEmail={user.email} userType="passenger" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={!!cancelRequest} onOpenChange={() => setCancelRequest(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader><DialogTitle>Cancel Ride?</DialogTitle></DialogHeader>
          <p className="text-gray-600">Are you sure you want to cancel this ride?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelRequest(null)} className="rounded-xl">Keep Ride</Button>
            <Button variant="destructive" onClick={() => cancelRequestMutation.mutate(cancelRequest?.id)} disabled={cancelRequestMutation.isPending} className="rounded-xl">
              {cancelRequestMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Cancel Ride
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {reviewTarget && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => { setReviewModalOpen(false); setReviewTarget(null); }}
          onSubmit={submitReview}
          revieweeEmail={reviewTarget.driverEmail}
          revieweeName={reviewTarget.driverName}
          reviewerType="driver"
          isSubmitting={isSubmittingReview}
        />
      )}

      {showTipModal && (
        <Dialog open={!!showTipModal} onOpenChange={() => setShowTipModal(null)}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <TipDriver rideRequest={showTipModal} onTipSubmitted={() => setShowTipModal(null)} />
          </DialogContent>
        </Dialog>
      )}

      {showSplitModal && (
        <Dialog open={!!showSplitModal} onOpenChange={() => setShowSplitModal(null)}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <SplitFare rideRequest={showSplitModal} userEmail={user?.email} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}