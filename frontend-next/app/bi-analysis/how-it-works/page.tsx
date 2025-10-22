"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import {biHowItWorksSteps} from "@/lib/constants";
import { containerAnimationVariants, itemAnimationVariants } from '@/lib/constants';

const HowItWorksCRM = () => {

  return (
    <div className="py-5 sm:py-10">
      <div className="container mx-auto px-4">

        {/* header div */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* title */}
          <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            How <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">BI Analysis</span> Works
          </h1>

          {/* description */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the simple yet powerful process behind our AI-driven data analysis. Get from data to decisions in just a few steps.
          </p>
        </motion.div>

        {/* steps container */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerAnimationVariants}
          initial="hidden"
          animate="visible"
        >
          {/* loop through each step */}
          {biHowItWorksSteps.map((step, index) => (
            <motion.div key={index} variants={itemAnimationVariants}>
              <Card className="bg-muted/50 h-full flex flex-col shadow-lg hover:shadow-primary/20 transition-shadow duration-300 border border-border/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                  <span>
                    <step.icon className={`h-10 w-10 ${index % 2 == 0 ? "text-primary" : "text-secondary"} `} />
                  </span>
                  <CardTitle className="break-words text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* back button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: biHowItWorksSteps.length * 0.1 + 0.2 }}
          className="text-center mt-16"
        >
          <Link href="/bi-analysis/display">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-primary-foreground shadow-lg transform hover:scale-105">
              Upload your CSV
            </Button>
          </Link>
        </motion.div>

        
      </div>
    </div>
  );
};

export default HowItWorksCRM;