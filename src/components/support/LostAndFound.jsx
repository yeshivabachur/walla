import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Phone, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function LostAndFound({ userEmail, userType }) {
  const [isReporting, setIsReporting] = useState(false);
  const [reportData, setReportData] = useState({
    ride_request_id: '',
    item_description: '',
    item_category: 'other',
    contact_phone: ''
  });
  const queryClient = useQueryClient();

  const { data: myRides = [] } = useQuery({
    queryKey: ['recentRides', userEmail],
    queryFn: () => base44.entities.RideRequest.filter(
      userType === 'driver' 
        ? { driver_email: userEmail, status: 'completed' }
        : { passenger_email: userEmail, status: 'completed' },
      '-created_date',
      20
    ),
    enabled: !!userEmail
  });

  const { data: lostItems = [] } = useQuery({
    queryKey: ['lostItems', userEmail],
    queryFn: () => base44.entities.LostItem.filter({ reporter_email: userEmail }),
    enabled: !!userEmail
  });

  const reportMutation = useMutation({
    mutationFn: async () => {
      const ride = myRides.find(r => r.id === reportData.ride_request_id);
      
      await base44.entities.LostItem.create({
        ...reportData,
        reporter_email: userEmail,
        reporter_type: userType,
        status: 'reported'
      });

      // Notify the other party
      const notifyEmail = userType === 'driver' ? ride.passenger_email : ride.driver_email;
      await base44.integrations.Core.SendEmail({
        to: notifyEmail,
        subject: 'Lost Item Report - Walla',
        body: `A lost item has been reported for your recent ride.

Item: ${reportData.item_description}
Category: ${reportData.item_category}
Contact: ${reportData.contact_phone}

Please check if you have this item and contact the reporter directly.

Walla Team`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['lostItems']);
      setIsReporting(false);
      setReportData({ ride_request_id: '', item_description: '', item_category: 'other', contact_phone: '' });
      toast.success('Lost item reported. We\'ll help connect you!');
    }
  });

  const statusConfig = {
    reported: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Searching' },
    found: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Found' },
    returned: { icon: CheckCircle, color: 'bg-blue-100 text-blue-800', label: 'Returned' },
    closed: { icon: AlertCircle, color: 'bg-gray-100 text-gray-800', label: 'Closed' }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Lost & Found
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReporting(!isReporting)}
            className="rounded-xl"
          >
            Report Lost Item
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence>
          {isReporting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pb-4 border-b"
            >
              <Select
                value={reportData.ride_request_id}
                onValueChange={(value) => setReportData({ ...reportData, ride_request_id: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select ride" />
                </SelectTrigger>
                <SelectContent>
                  {myRides.map((ride) => (
                    <SelectItem key={ride.id} value={ride.id}>
                      {ride.pickup_location} → {ride.dropoff_location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={reportData.item_category}
                onValueChange={(value) => setReportData({ ...reportData, item_category: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">📱 Phone</SelectItem>
                  <SelectItem value="wallet">💳 Wallet</SelectItem>
                  <SelectItem value="keys">🔑 Keys</SelectItem>
                  <SelectItem value="bag">🎒 Bag</SelectItem>
                  <SelectItem value="clothing">👕 Clothing</SelectItem>
                  <SelectItem value="electronics">💻 Electronics</SelectItem>
                  <SelectItem value="documents">📄 Documents</SelectItem>
                  <SelectItem value="other">📦 Other</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Describe the item in detail..."
                value={reportData.item_description}
                onChange={(e) => setReportData({ ...reportData, item_description: e.target.value })}
                className="rounded-xl resize-none"
                rows={3}
              />

              <Input
                placeholder="Contact phone number"
                value={reportData.contact_phone}
                onChange={(e) => setReportData({ ...reportData, contact_phone: e.target.value })}
                className="rounded-xl"
              />

              <Button
                onClick={() => reportMutation.mutate()}
                disabled={!reportData.ride_request_id || !reportData.item_description || reportMutation.isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              >
                Submit Report
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {lostItems.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No lost items reported</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lostItems.map((item) => {
              const status = statusConfig[item.status];
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{item.item_category}</p>
                      <p className="text-sm text-gray-600">{item.item_description}</p>
                    </div>
                    <Badge className={status.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="w-3 h-3" />
                    {item.contact_phone}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}