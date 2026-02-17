import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Award, Clock, CheckCircle, Loader2, PlayCircle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import TrainingLesson from '@/components/training/TrainingLesson';
import TrainingQuiz from '@/components/training/TrainingQuiz';

export default function DriverTraining() {
  const [user, setUser] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
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

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['trainingLessons'],
    queryFn: () => base44.entities.TrainingLesson.list()
  });

  const { data: completions = [] } = useQuery({
    queryKey: ['myCompletions', user?.email],
    queryFn: () => base44.entities.TrainingCompletion.filter({ driver_email: user.email }),
    enabled: !!user
  });

  const completeMutation = useMutation({
    mutationFn: async ({ lessonId, score, timeSpent, badgeEarned }) => {
      return await base44.entities.TrainingCompletion.create({
        driver_email: user.email,
        lesson_id: lessonId,
        quiz_score: score,
        time_spent_minutes: timeSpent,
        badge_earned: badgeEarned,
        passed: score >= 70
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myCompletions']);
      toast.success('Lesson completed! Badge earned! 🎉');
    }
  });

  const isLessonCompleted = (lessonId) => {
    return completions.some(c => c.lesson_id === lessonId && c.passed);
  };

  const getCompletionScore = (lessonId) => {
    const completion = completions.find(c => c.lesson_id === lessonId);
    return completion?.quiz_score || 0;
  };

  const lessonsByCategory = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) acc[lesson.category] = [];
    acc[lesson.category].push(lesson);
    return acc;
  }, {});

  const totalCompleted = completions.filter(c => c.passed).length;
  const totalBadges = [...new Set(completions.filter(c => c.badge_earned).map(c => c.badge_earned))].length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (selectedLesson && !showQuiz) {
    return (
      <TrainingLesson
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
        onStartQuiz={() => setShowQuiz(true)}
        isCompleted={isLessonCompleted(selectedLesson.id)}
      />
    );
  }

  if (selectedLesson && showQuiz) {
    return (
      <TrainingQuiz
        lesson={selectedLesson}
        onComplete={(score, timeSpent) => {
          completeMutation.mutate({
            lessonId: selectedLesson.id,
            score,
            timeSpent,
            badgeEarned: selectedLesson.badge_reward
          });
          setShowQuiz(false);
          setSelectedLesson(null);
        }}
        onBack={() => setShowQuiz(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Training Center</h1>
            <p className="text-gray-600 mt-1">Improve your skills and earn badges</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-2">
                <BookOpen className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalCompleted}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-2">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalBadges}</p>
              <p className="text-xs text-gray-500">Badges</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-white border mb-6">
            <TabsTrigger value="all">All Lessons</TabsTrigger>
            <TabsTrigger value="safe_driving">Safe Driving</TabsTrigger>
            <TabsTrigger value="customer_service">Customer Service</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="badges">My Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full"
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`${
                          lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {lesson.difficulty}
                        </Badge>
                        {isLessonCompleted(lesson.id) && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.duration_minutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {lesson.badge_reward}
                        </span>
                      </div>
                      {isLessonCompleted(lesson.id) && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-green-600 font-semibold">
                            Score: {getCompletionScore(lesson.id)}%
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {Object.entries(lessonsByCategory).map(([category, categoryLessons]) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryLessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full"
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={`${
                            lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                            lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {lesson.difficulty}
                          </Badge>
                          {isLessonCompleted(lesson.id) && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration_minutes} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {lesson.badge_reward}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}

          <TabsContent value="badges">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {completions.filter(c => c.badge_earned).map((completion, index) => (
                <motion.div
                  key={completion.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50">
                    <CardContent className="p-6 text-center">
                      <div className="text-6xl mb-3">🏆</div>
                      <p className="font-bold text-gray-900">{completion.badge_earned}</p>
                      <p className="text-xs text-gray-600 mt-2">Score: {completion.quiz_score}%</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(completion.created_date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}