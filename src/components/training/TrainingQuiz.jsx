import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrainingQuiz({ lesson, onComplete, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = lesson.quiz_questions || [];
  const question = questions[currentQuestion];

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] ?? null);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const correct = answers.filter((answer, index) => 
      answer === questions[index].correct_answer
    ).length;
    return Math.round((correct / questions.length) * 100);
  };

  const handleFinish = () => {
    const score = calculateScore();
    onComplete(score, lesson.duration_minutes);
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className={`border-0 shadow-xl ${passed ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-red-50 to-orange-50'}`}>
              <CardHeader>
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    passed ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {passed ? (
                      <CheckCircle className="w-10 h-10 text-white" />
                    ) : (
                      <XCircle className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <CardTitle className="text-3xl mb-2">
                    {passed ? 'Congratulations! 🎉' : 'Keep Trying!'}
                  </CardTitle>
                  <p className="text-lg text-gray-600">
                    You scored <strong className={passed ? 'text-green-600' : 'text-red-600'}>{score}%</strong>
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {passed ? (
                    <>
                      <div className="bg-white rounded-xl p-6 text-center">
                        <p className="text-6xl mb-3">🏆</p>
                        <p className="font-bold text-gray-900 text-xl mb-2">
                          Badge Earned: {lesson.badge_reward}
                        </p>
                        <p className="text-sm text-gray-600">
                          You've successfully completed this training lesson!
                        </p>
                      </div>
                      <Button
                        onClick={handleFinish}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Continue
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="bg-white rounded-xl p-6">
                        <p className="text-gray-700 mb-4">
                          You need at least 70% to pass. Review the lesson material and try again!
                        </p>
                        <p className="text-sm text-gray-600">
                          Correct answers: {answers.filter((answer, index) => 
                            answer === questions[index].correct_answer
                          ).length} out of {questions.length}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={onBack}
                          variant="outline"
                          className="flex-1"
                        >
                          Review Lesson
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentQuestion(0);
                            setAnswers([]);
                            setShowResults(false);
                            setSelectedAnswer(null);
                          }}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                        >
                          Retry Quiz
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lesson
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">
                  Question {currentQuestion + 1} of {questions.length}
                </Badge>
                <p className="text-sm text-gray-500">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <AnimatePresence mode="wait">
                  {question.options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAnswer(index)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedAnswer === index
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === index
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswer === index && (
                            <div className="w-3 h-3 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-gray-900">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentQuestion > 0) {
                      setCurrentQuestion(currentQuestion - 1);
                      setSelectedAnswer(answers[currentQuestion - 1] ?? null);
                    }
                  }}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}