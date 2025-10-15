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
  const [analysing, setAnalysing] = useState(false);
  

  if(analysing){
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <h2 className="text-2xl font-semibold">Analyzing Your Website...</h2>
          <p className="text-muted-foreground">This might take a moment, please do not close the tab.</p>
        </motion.div>
      </div>
    )
  }else{
    return (
      <>
        <Button onClick={()=>{console.log(process.env.NEXT_PUBLIC_BACKEND_URL);}}>test</Button>
        <HeroSection setAnalysing={setAnalysing}/>
        <ValuePropositionSection />
        <BenefitsSection />
        <SocialProofSection />
        <CtaSection setAnalysing={setAnalysing}/>
      </>
    );
  }

};

export default HomePage;
