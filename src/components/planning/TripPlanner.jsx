import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Trash2, Clock, DollarSign, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function TripPlanner({ userEmail }) {
  const [isOpen, setIsOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [stops, setStops] = useState([{ location: '', duration_minutes: 15, notes: '' }]);
  const queryClient = useQueryClient();

  const addStop = () => {
    setStops([...stops, { location: '', duration_minutes: 15, notes: '' }]);
  };

  const removeStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const updateStop = (index, field, value) => {
    const newStops = [...stops];
    newStops[index][field] = value;
    setStops(newStops);
  };

  const createPlanMutation = useMutation({
    mutationFn: async () => {
      const totalTime = stops.reduce((sum, stop) => sum + (parseInt(stop.duration_minutes) || 0), 0);
      const estimatedCost = stops.length * 15; // $15 per stop estimate

      await base44.entities.TripPlan.create({
        user_email: userEmail,
        plan_name: planName || 'My Trip',
        stops,
        start_time: new Date().toISOString(),
        total_estimated_cost: estimatedCost,
        total_estimated_time: totalTime,
        status: 'draft',
        ai_optimized: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tripPlans']);
      toast.success('Trip plan created!');
      setPlanName('');
      setStops([{ location: '', duration_minutes: 15, notes: '' }]);
      setIsOpen(false);
    }
  });

  const optimizePlan = async () => {
    if (stops.length < 2) {
      toast.error('Add at least 2 stops to optimize');
      return;
    }

    toast.info('AI is optimizing your route...');
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Optimize this multi-stop trip plan:

Stops: ${stops.map((s, i) => `${i + 1}. ${s.location} (${s.duration_minutes} min)`).join('\n')}

Provide:
1. Optimized order of stops (by index)
2. Total estimated time in minutes
3. Total estimated cost
4. Tips for efficient routing`,
        response_json_schema: {
          type: 'object',
          properties: {
            optimized_order: { type: 'array', items: { type: 'number' } },
            total_time: { type: 'number' },
            total_cost: { type: 'number' },
            tips: { type: 'string' }
          }
        }
      });

      const optimizedStops = result.optimized_order.map(i => stops[i]);
      setStops(optimizedStops);
      toast.success(`✨ Route optimized! ${result.tips}`);
    } catch (error) {
      toast.error('Could not optimize route');
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full rounded-xl mb-4"
      >
        🗺️ Plan Multi-Stop Trip
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Trip Planner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Trip name (e.g., Shopping Day)"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="rounded-xl"
                />

                <div className="space-y-3">
                  {stops.map((stop, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-xl p-3"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Badge className="bg-green-600 text-white">#{index + 1}</Badge>
                        <Input
                          placeholder="Location"
                          value={stop.location}
                          onChange={(e) => updateStop(index, 'location', e.target.value)}
                          className="flex-1 h-9"
                        />
                        {stops.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStop(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Minutes"
                          value={stop.duration_minutes}
                          onChange={(e) => updateStop(index, 'duration_minutes', e.target.value)}
                          className="w-24 h-9"
                        />
                        <Input
                          placeholder="Notes (optional)"
                          value={stop.notes}
                          onChange={(e) => updateStop(index, 'notes', e.target.value)}
                          className="flex-1 h-9"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addStop}
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Stop
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={optimizePlan}
                    className="flex-1"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    AI Optimize
                  </Button>
                </div>

                <div className="bg-gray-100 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {stops.reduce((sum, s) => sum + (parseInt(s.duration_minutes) || 0), 0)} min
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ~${stops.length * 15}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => createPlanMutation.mutate()}
                  disabled={stops.some(s => !s.location) || createPlanMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Save Trip Plan
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}