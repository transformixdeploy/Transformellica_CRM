"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import FileUpload from '../../components/FileUpload';
import { Question } from '../../lib/formConfig';

// this component takes the question to render it as a from of one field and also takes the function needed to maintain the state of the question in "MultiStepFormWizard"

interface QuestionRendererProps {
  question: Question;
  value: string | File | null;
  error?: string;
  onChange: (id: string, value: string) => void;
  onFileChange: (id: string, file: File | null) => void;
  direction: number;
  variants: Variants;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, value, error, onChange, onFileChange, direction, variants }) => {
  return (
    <motion.div
      key={question.id}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
      className="space-y-4 md:space-y-6"
    >
      <div>
        <Label htmlFor={question.id} className="text-md md:text-lg font-medium text-foreground/90">
          {question.label}
        </Label>
        <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
          {question.required ? "This field is required." : "This field is optional."}
        </p>
        {question.type === 'textarea' ? (
          <textarea
            id={question.id}
            value={value as string}
            onChange={(e) => onChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full min-h-[80px] md:min-h-[100px] p-2 border rounded-md bg-input border-border/50 focus:ring-primary focus:border-primary text-sm md:text-base"
            required={question.required}
          />
        ) : question.type === 'file' ? (
           <FileUpload
              id={question.id}
              onFileChange={(file) => onFileChange(question.id, file)}
              accept={question.accept}
              fileName={(value as File)?.name}
              icon={question.icon ? <question.icon className={question.iconClassName} /> : undefined}
              iconClassName={question.iconClassName}
            />
        ) : (
          <Input
            id={question.id}
            type={question.type}
            value={value as string}
            onChange={(e) => onChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="bg-input border-border/50 focus:ring-primary text-sm md:text-base"
            required={question.required}
          />
        )}
        {error && <p className="text-xs md:text-sm text-destructive mt-1">{error}</p>}
      </div>
    </motion.div>
  );
};

export default QuestionRenderer;
