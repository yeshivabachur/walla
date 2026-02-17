import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, Clock, DollarSign, TrendingUp, 
  Calendar as CalendarIcon, Zap, Shield, 
  Navigation, Users, Activity, CheckCircle2,
  AlertTriangle, Radio, Globe, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import RealTimeHeatMap from '@/components/driver/RealTimeHeatMap.jsx';
import EarningsForecast from '@/components/predictions/EarningsForecast.jsx';
import LiveDemandHeatmap from '@/components/demand/LiveDemandHeatmap.jsx';
import DriverPreferredHours from '@/components/personalization/DriverPreferredHours.jsx';
import DriverSkillAssessment from '@/components/certifications/DriverSkillAssessment.jsx';
import DriverBehaviorScore from '@/components/safety/DriverBehaviorScore.jsx';
import VehicleHealthCard from '@/components/maintenance/VehicleHealthCard.jsx';
import SmartEarningsOptimizer from '@/components/ai/SmartEarningsOptimizer.jsx';
import DriverMentorMatch from '@/components/social/DriverMentorMatch.jsx';

const CITY_COORDS = {
  'San Francisco': { latitude: 37.7749, longitude: -122.4194 },
  'Los Angeles': { latitude: 34.0522, longitude: -118.2437 },
  'New York': { latitude: 40.7128, longitude: -74.006 },
  'Chicago': { latitude: 41.8781, longitude: -87.6298 },
  'Miami': { latitude: 25.7617, longitude: -80.1918 }
};

export default function OfferRide() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    start_location: '',
    end_location: '',
    available_seats: '4',
    start_time: 'now',
    is_recurring: false,
    recurrence_pattern: 'daily',
    price_per_seat: '',
    vehicle_id: '',
    notes: ''
  });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const offerMutation = useMutation({
    mutationFn: async (offerData) => {
      return await base44.entities.Ride.create(offerData);
    },
    onSuccess: () => {
      toast.success('Ride offer posted successfully!');
      navigate(createPageUrl('DriverDashboard'));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login required');
    
    offerMutation.mutate({
      driver_name: user.full_name,
      driver_email: user.email,
      start_location: formData.start_location,
      end_location: formData.end_location,
      available_seats: parseInt(formData.available_seats),
      start_time: formData.start_time,
      price_per_seat: parseFloat(formData.price_per_seat),
      status: 'available',
      is_recurring: formData.is_recurring,
      recurrence_pattern: formData.recurrence_pattern
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-8 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic flex items-center gap-4 text-emerald-400">
              <Zap className="w-12 h-12" />
              Offer a Ride
            </h1>
            <p className="text-white/40 font-mono text-sm mt-2 uppercase">Publish your route and monetize empty seats</p>
          </div>
          <div className="flex gap-4">
            <Badge className="bg-emerald-600 h-10 px-6 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase">
              <Activity className="w-4 h-4" />
              OPTIMAL_DEMAND_DETECTION
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Driver Intel Column */}
          <div className="space-y-8 order-2 lg:order-1">
            <LiveDemandHeatmap />
            <EarningsForecast userEmail={user?.email} />
            <SmartEarningsOptimizer userEmail={user?.email} />
            <DriverBehaviorScore userEmail={user?.email} />
            <VehicleHealthCard />
          </div>

          {/* Offer Form Column */}
          <div className="lg:col-span-2 space-y-8 order-1 lg:order-2">
            <Card className="bg-white/5 border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Navigation className="w-64 h-64 text-emerald-400" />
              </div>
              
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Start Location</Label>
                      <Select onValueChange={(v) => setFormData({...formData, start_location: v})}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl">
                          <SelectValue placeholder="Select Origin" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(CITY_COORDS).map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Destination</Label>
                      <Select onValueChange={(v) => setFormData({...formData, end_location: v})}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl">
                          <SelectValue placeholder="Select Destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(CITY_COORDS).map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Seats Available</Label>
                      <Input 
                        type="number" 
                        value={formData.available_seats}
                        onChange={(e) => setFormData({...formData, available_seats: e.target.value})}
                        className="bg-white/5 border-white/10 h-14 rounded-2xl font-black italic text-xl"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Price per Seat ($)</Label>
                      <Input 
                        type="number" 
                        value={formData.price_per_seat}
                        onChange={(e) => setFormData({...formData, price_per_seat: e.target.value})}
                        placeholder="e.g. 25"
                        className="bg-white/5 border-white/10 h-14 rounded-2xl font-black italic text-xl"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Departure Time</Label>
                      <Input 
                        type="time" 
                        onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                        className="bg-white/5 border-white/10 h-14 rounded-2xl font-black italic"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={formData.is_recurring}
                        onChange={(e) => setFormData({...formData, is_recurring: e.target.checked})}
                        className="w-5 h-5 rounded-lg border-white/10 bg-white/5"
                      />
                      <Label className="text-xs font-black uppercase">Recurring Ride</Label>
                    </div>
                    {formData.is_recurring && (
                      <Select onValueChange={(v) => setFormData({...formData, recurrence_pattern: v})}>
                        <SelectTrigger className="bg-black/20 border-white/10 h-10 w-40 rounded-xl text-xs">
                          <SelectValue placeholder="Daily" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <Button 
                    type="submit"
                    disabled={offerMutation.isPending}
                    className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all"
                  >
                    {offerMutation.isPending ? 'Publishing Manifold...' : 'Broadcast Ride Offer'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <DriverPreferredHours userEmail={user?.email} />
               <DriverMentorMatch userEmail={user?.email} />
            </div>

            <DriverSkillAssessment userEmail={user?.email} />
          </div>
        </div>
      </div>
    </div>
  );
}
