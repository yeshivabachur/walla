import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SmilePlus, Frown, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SentimentAnalysis({ userEmail }) {
  const [sentiment, setSentiment] = useState(null);

  const { data: recentRides = [] } = useQuery({
    queryKey: ['sentimentRides', userEmail],
    queryFn: () => base44.entities.RideRequest.filter({
      passenger_email: userEmail,
      status: 'completed'
    }, '-created_date', 10)
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['sentimentReviews', userEmail],
    queryFn: () => base44.entities.Review.filter({ reviewer_email: userEmail })
  });

  useEffect(() => {
    if (recentRides.length < 3) return;

    const analyzeSentiment = async () => {
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze customer sentiment.

Recent rides: ${recentRides.length}
Average rating: ${avgRating}

Determine:
1. Overall sentiment (very_positive/positive/neutral/negative/very_negative)
2. Sentiment score (0-100)
3. Key themes from ride patterns
4. Churn risk percentage
5. Retention recommendations`,
        response_json_schema: {
          type: 'object',
          properties: {
            overall_sentiment: { type: 'string' },
            sentiment_score: { type: 'number' },
            key_themes: { type: 'array', items: { type: 'string' } },
            churn_risk: { type: 'number' },
            retention_recommendations: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setSentiment(result);

      await base44.entities.CustomerSentiment.create({
        user_email: userEmail,
        analysis_date: new Date().toISOString().split('T')[0],
        overall_sentiment: result.overall_sentiment,
        sentiment_score: result.sentiment_score,
        key_themes: result.key_themes,
        churn_risk: result.churn_risk,
        retention_recommendations: result.retention_recommendations
      });
    };

    analyzeSentiment();
  }, [recentRides, reviews, userEmail]);

  if (!sentiment) return null;

  const sentimentConfig = {
    very_positive: { color: 'bg-green-600', icon: SmilePlus },
    positive: { color: 'bg-green-500', icon: SmilePlus },
    neutral: { color: 'bg-gray-500', icon: AlertCircle },
    negative: { color: 'bg-orange-500', icon: Frown },
    very_negative: { color: 'bg-red-600', icon: Frown }
  };

  const config = sentimentConfig[sentiment.overall_sentiment] || sentimentConfig.neutral;
  const Icon = config.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-cyan-600" />
              Customer Sentiment
            </span>
            <Badge className={`${config.color} text-white`}>
              {sentiment.sentiment_score}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Satisfaction Level</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={config.color}
                initial={{ width: 0 }}
                animate={{ width: `${sentiment.sentiment_score}%` }}
              />
            </div>
          </div>

          {sentiment.churn_risk > 30 && (
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <p className="text-xs font-semibold text-orange-800">
                  Churn Risk: {sentiment.churn_risk}%
                </p>
              </div>
              {sentiment.retention_recommendations?.slice(0, 2).map((rec, idx) => (
                <p key={idx} className="text-xs text-orange-700 mt-1">• {rec}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}