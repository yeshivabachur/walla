import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Wrench, Battery } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FleetManagementCard({ driverEmail }) {
  const { data: vehicles = [] } = useQuery({
    queryKey: ['fleetVehicles', driverEmail],
    queryFn: () => base44.entities.FleetVehicle.filter({ driver_email: driverEmail })
  });

  const activeVehicle = vehicles.find(v => v.status === 'active');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-slate-600" />
            My Vehicle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeVehicle ? (
            <>
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">
                    {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                  </p>
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>
                <p className="text-xs text-gray-600">{activeVehicle.license_plate}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg p-2 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-slate-600" />
                  <div>
                    <p className="text-xs text-gray-500">Miles</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {activeVehicle.total_miles?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-2 flex items-center gap-2">
                  <Battery className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm font-semibold text-gray-900 capitalize">
                      {activeVehicle.fuel_type}
                    </p>
                  </div>
                </div>
              </div>

              {activeVehicle.next_maintenance_due && (
                <div className="bg-orange-50 rounded-lg p-2 border border-orange-200">
                  <p className="text-xs text-orange-800">
                    🔧 Maintenance due: {new Date(activeVehicle.next_maintenance_due).toLocaleDateString()}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg p-4 text-center">
              <Car className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No vehicle assigned</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}