import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
}

// just a bar with animation :)

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, currentStep, totalSteps }) => {
  const displayStep = currentStep > 0 ? currentStep : 0;
  const displayTotalSteps = totalSteps > 0 ? totalSteps : 0;

  return (
    <div className="w-full mb-1 md:mb-2">
      <div className="flex justify-between items-center mb-1 text-xs md:text-sm text-muted-foreground">
        <span>Progress</span>
        {displayTotalSteps > 0 && displayStep > 0 && (
          <span>Step {displayStep} of {displayTotalSteps}</span>
        )}
      </div>
      <div className="w-full bg-muted rounded-full h-2 md:h-2.5 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
