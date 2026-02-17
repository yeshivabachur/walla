import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, Utensils, Coffee, Music, Briefcase, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RideExperienceEnhancer({ destination, userProfile }) {
  const [localGuide, setLocalGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!destination) return;

    const generateGuide = async () => {
      setIsLoading(true);
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `You are a local guide AI for a ride-hailing app. The passenger is heading to ${destination}.

Provide personalized recommendations:
1. Top 3 restaurants/cafes near destination
2. Top 3 entertainment/attractions nearby
3. Local insider tips
4. Best times to visit these places

Make it conversational and helpful. Consider it's currently ${new Date().toLocaleTimeString()}.`,
          response_json_schema: {
            type: 'object',
            properties: {
              restaurants: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    distance: { type: 'string' }
                  }
                }
              },
              attractions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    distance: { type: 'string' }
                  }
                }
              },
              insider_tips: { type: 'array', items: { type: 'string' } },
              best_times: { type: 'string' }
            }
          }
        });

        setLocalGuide(result);
      } catch (error) {
        console.error('Failed to generate local guide:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateGuide();
  }, [destination]);

  if (!destination) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Local Guide
          </CardTitle>
          <p className="text-sm text-gray-600">Discover what's around your destination</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Discovering local gems...</p>
            </div>
          ) : localGuide ? (
            <Tabs defaultValue="restaurants">
              <TabsList className="grid grid-cols-3 w-full mb-4">
                <TabsTrigger value="restaurants">
                  <Utensils className="w-4 h-4 mr-1" />
                  Dining
                </TabsTrigger>
                <TabsTrigger value="attractions">
                  <MapPin className="w-4 h-4 mr-1" />
                  Places
                </TabsTrigger>
                <TabsTrigger value="tips">
                  <Coffee className="w-4 h-4 mr-1" />
                  Tips
                </TabsTrigger>
              </TabsList>

              <TabsContent value="restaurants" className="space-y-3">
                {localGuide.restaurants?.map((restaurant, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-lg p-4 border border-purple-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {restaurant.distance}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{restaurant.description}</p>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="attractions" className="space-y-3">
                {localGuide.attractions?.map((attraction, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-lg p-4 border border-purple-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{attraction.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {attraction.distance}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{attraction.description}</p>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="tips" className="space-y-3">
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Insider Tips</h4>
                  <ul className="space-y-2">
                    {localGuide.insider_tips?.map((tip, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-purple-100 rounded-lg p-4">
                  <p className="text-xs font-semibold text-purple-900 mb-1">⏰ Best Times</p>
                  <p className="text-sm text-purple-800">{localGuide.best_times}</p>
                </div>
              </TabsContent>
            </Tabs>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}