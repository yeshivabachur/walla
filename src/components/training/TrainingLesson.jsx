import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, PlayCircle, CheckCircle, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function TrainingLesson({ lesson, onBack, onStartQuiz, isCompleted }) {
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Increment every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lessons
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-xl mb-6">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge className={`${
                    lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {lesson.difficulty}
                  </Badge>
                  <Badge variant="outline">{lesson.category.replace('_', ' ')}</Badge>
                  {isCompleted && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Est. Duration</p>
                  <p className="font-semibold text-gray-900">{lesson.duration_minutes} min</p>
                </div>
              </div>
              <CardTitle className="text-2xl">{lesson.title}</CardTitle>
              <p className="text-gray-600 mt-2">{lesson.description}</p>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span>Complete the quiz to earn: <strong>{lesson.badge_reward}</strong></span>
                  </div>
                  <Button
                    onClick={onStartQuiz}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-blue-50">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Take your time reading through the material. You'll need a score of 70% or higher to pass the quiz and earn your badge.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}