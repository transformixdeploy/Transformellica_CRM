"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import ValuePropositionSection from '../components/ValuePropositionSection';
import BenefitsSection from '../components/BenefitsSection';
import SocialProofSection from '../components/SocialProofSection';
import CtaSection from '../components/CtaSection';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const [analysingWeb, setAnalysingWeb] = useState(false);
  const [analysingSocial, setAnalysingSocial] = useState(false);
  const [analysingBranding, setAnalysingBranding] = useState(false);
  const [analysingSentiment, setAnalysingSentiment] = useState(false);
  

  if(analysingWeb){
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <h2 className="text-2xl font-semibold">Scanning Every Corner of Your Website</h2>
          <p className="text-muted-foreground">Evaluating SEO, speed, and UX to reveal your site’s strengths and weaknesses all in under 5 minutes.</p>
        </motion.div>
      </div>
    )
  }else if(analysingSocial){
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <h2 className="text-2xl font-semibold">Analyzing What Drives Engagement</h2>
          <p className="text-muted-foreground">Scanning your posts, reach, and audience reactions to uncover what truly works delivering insights in minutes, not days.</p>
        </motion.div>
      </div>
    )
  }else if(analysingBranding){
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <h2 className="text-2xl font-semibold">Measuring Brand Consistency & Impact</h2>
          <p className="text-muted-foreground">Reviewing visuals, tone, and alignment on all platforms to show how recognizable your brand truly is faster than any manual audit.</p>
        </motion.div>
      </div>
    )
  }else if(analysingSentiment){
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <h2 className="text-2xl font-semibold">Understanding What People Really Think</h2>
          <p className="text-muted-foreground">Processing thousands of reviews and mentions to capture authentic emotions it takes a few extra minutes but saves you weeks of manual work.</p>
        </motion.div>
      </div>
    )
  }else{
    return (
      <>
        <HeroSection setWebAnalysing={setAnalysingWeb} setBrandingAnalysing={setAnalysingBranding} setSocialAnalysing={setAnalysingSocial} setSentimentAnalysing={setAnalysingSentiment}/>
        <ValuePropositionSection />
        <BenefitsSection />
        <SocialProofSection />
        <CtaSection setWebAnalysing={setAnalysingWeb} setBrandingAnalysing={setAnalysingBranding} setSocialAnalysing={setAnalysingSocial} setSentimentAnalysing={setAnalysingSentiment}/>
      </>
    );
  }

};

export default HomePage;
