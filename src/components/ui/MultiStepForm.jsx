import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import Stepper from './Stepper';
import GradientButton from './GradientButton';
import { Button } from './button';

export default function MultiStepForm({ 
  steps,
  onComplete,
  className = ''
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.(formData);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <div className={className}>
      {/* Stepper */}
      <Stepper
        steps={steps.map(s => s.title)}
        currentStep={currentStep}
        className="mb-12"
      />

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {React.cloneElement(steps[currentStep].component, {
            data: formData,
            onChange: updateFormData
          })}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isFirstStep}
          className="h-12 px-6 rounded-xl"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-sm text-gray-600 font-medium">
          Step {currentStep + 1} of {steps.length}
        </div>

        <GradientButton
          onClick={handleNext}
          className="h-12 px-6 rounded-xl"
        >
          {isLastStep ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Complete
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </GradientButton>
      </div>
    </div>
  );
}