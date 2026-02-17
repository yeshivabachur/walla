import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Mountain, Briefcase, Heart, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const experienceIcons = {
  luxury: Crown,
  scenic: Mountain,
  executive: Briefcase,
  wellness: Heart,
  party: PartyPopper
};

export default function PremiumExperienceSelector({ onSelect, selectedExperience }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: experiences = [] } = useQuery({
    queryKey: ['premiumExperiences'],
    queryFn: async () => {
      let items = await base44.entities.PremiumRideExperience.filter({ available: true });
      
      if (items.length === 0) {
        // Create default experiences
        await base44.entities.PremiumRideExperience.bulkCreate([
          {
            name: 'Luxury Ride',
            tier: 'luxury',
            description: 'Premium vehicles with leather seats, champagne, and white-glove service',
            price_multiplier: 2.5,
            features: ['Premium vehicle', 'Champagne', 'Phone chargers', 'Bottled water'],
            minimum_tier: 'gold'
          },
          {
            name: 'Scenic Route',
            tier: 'scenic',
            description: 'Take the beautiful route with breathtaking views',
            price_multiplier: 1.5,
            features: ['Scenic route', 'Photo stops', 'Local guide commentary'],
            minimum_tier: 'silver'
          },
          {
            name: 'Executive',
            tier: 'executive',
            description: 'Business-class experience with WiFi and workspace',
            price_multiplier: 2.0,
            features: ['High-speed WiFi', 'Workspace', 'Privacy partition', 'Newspapers'],
            minimum_tier: 'platinum'
          },
          {
            name: 'Wellness Ride',
            tier: 'wellness',
            description: 'Relaxing experience with aromatherapy and calming ambiance',
            price_multiplier: 1.8,
            features: ['Aromatherapy', 'Meditation music', 'Massage seats'],
            minimum_tier: 'silver'
          }
        ]);
        
        items = await base44.entities.PremiumRideExperience.filter({ available: true });
      }
      
      return items;
    }
  });

  return (
    <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            Premium Experiences
          </span>
          {selectedExperience && (
            <Badge className="bg-amber-600 text-white">
              {selectedExperience.price_multiplier}x
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {selectedExperience && !isExpanded && (
          <div className="bg-white rounded-xl p-4">
            <p className="font-semibold text-gray-900 mb-1">{selectedExperience.name}</p>
            <p className="text-xs text-gray-600 mb-2">{selectedExperience.description}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {selectedExperience.features?.map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  ✨ {feature}
                </Badge>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect(null)}
              className="w-full"
            >
              Remove Premium
            </Button>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          {isExpanded ? 'Hide Options' : selectedExperience ? 'Change Experience' : 'Add Premium Experience'}
        </Button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {experiences.map((exp) => {
                const Icon = experienceIcons[exp.tier] || Sparkles;
                return (
                  <motion.button
                    key={exp.id}
                    onClick={() => {
                      onSelect(exp);
                      setIsExpanded(false);
                    }}
                    className="w-full bg-white rounded-xl p-4 text-left hover:shadow-md transition-shadow border-2 border-transparent hover:border-amber-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-amber-600" />
                        <p className="font-semibold text-gray-900">{exp.name}</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">
                        +{Math.round((exp.price_multiplier - 1) * 100)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{exp.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {exp.features?.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="text-xs text-gray-500">
                          • {feature}
                        </span>
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}