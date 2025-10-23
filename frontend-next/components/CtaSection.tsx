"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Rocket, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import MultiStepFormWizard from './MultiStepFormWizard';

interface CTASectionProps {
  setWebAnalysing: (analysing: boolean) => void;
  setSocialAnalysing: (analysing: boolean) => void;
  setBrandingAnalysing: (analysing: boolean) => void;
  setSentimentAnalysing: (analysing: boolean) => void;
}

const CtaSection: React.FC<CTASectionProps> = ({ setWebAnalysing, setSocialAnalysing, setBrandingAnalysing, setSentimentAnalysing }) => {

  const [open, setOpen] = useState(false);

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/80 to-secondary/80 text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        
        {/* title  */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold mb-6"
        >
          Ready to Dominate Your Market?
        </motion.h2>
        
        {/* description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 opacity-90"
        >
          {"Your competitors are already using AI to get ahead. Don't get left behind with outdated, manual analysis methods."}
        </motion.p>

        {/* action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4"
        >
    
          {/* start your free analysis button */}
          {/* this button triggers the dialog form */}
          <Dialog open={open} onOpenChange={setOpen}>
            
            {/* modal trigger */}
            <DialogTrigger asChild>
              <Button size="lg" className="bg-background text-primary hover:bg-background/90 shadow-lg transform hover:scale-105">
                <Rocket className="mr-2 h-5 w-5" /> Start Your Free Analysis
              </Button>
            </DialogTrigger>

            {/* modal content (which is the MultiStepWizard component) */}
            <DialogContent className="max-sm:max-w-2xs max-sm:max-h-[70vh] max-w-lg max-h-[90vh] bg-card border-border/70 p-0 overflow-hidden flex flex-col">
              <DialogTitle className="DialogTitle hidden"/>
              <MultiStepFormWizard setWebAnalysing={setWebAnalysing} setBrandingAnalysing={setBrandingAnalysing} setSocialAnalysing={setSocialAnalysing} setSentimentAnalysing={setSentimentAnalysing} onClose={() => setOpen(false)} />
            </DialogContent>
          </Dialog>

          {/* book a demo button       */}
          <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10 transform hover:scale-105 w-full sm:w-auto">
            <MessageSquare className="mr-2 h-5 w-5" /> Book a Demo
          </Button>
          
        </motion.div>

        {/* last sentence */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-sm opacity-80"
        >
          Complete analysis in under 10 minutes. No credit card required.
        </motion.p>
      
      
      </div>
    </section>
  );
};

export default CtaSection;
