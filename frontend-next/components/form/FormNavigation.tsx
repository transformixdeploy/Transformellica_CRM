"use client";

import React from 'react';
import { Button } from '../../components/ui/button';
import { DialogClose } from '../../components/ui/dialog';
import { Loader2, Send, ArrowLeft, ArrowRight } from 'lucide-react';

// Navigate between questions of the form data

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  isContinueDisabled: boolean;
  showCancel: boolean;
  submitButtonText?: string;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isSubmitting,
  isContinueDisabled,
  showCancel,
  submitButtonText = "Generate Report",
}) => {
  return (
    <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-2">
      {currentStep > 0 && !isSubmitting && (
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto hover:border-primary/50 text-sm md:text-base">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      )}
      
      {showCancel && !isSubmitting && (
        <DialogClose asChild className={currentStep > 0 ? "hidden sm:inline-flex" : "w-full sm:ml-auto sm:w-auto"}>
            <Button type="button" variant="ghost" className="text-sm md:text-base">
              Cancel
            </Button>
        </DialogClose>
      )}

      {currentStep <= totalSteps && currentStep > 0 && !isSubmitting && (
        <Button 
          onClick={onNext} 
          disabled={isSubmitting || isContinueDisabled}
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-primary-foreground text-sm md:text-base"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : currentStep === totalSteps ? (
            <Send className="mr-2 h-4 w-4" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          {isSubmitting ? 'Submitting...' : (currentStep === totalSteps ? submitButtonText : 'Continue')}
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
