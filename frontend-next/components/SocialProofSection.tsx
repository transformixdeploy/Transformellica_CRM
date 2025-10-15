"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Users } from 'lucide-react';

const SocialProofSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-background">


      <div className="container mx-auto px-4">
        
        {/* title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Users className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold">
            Join <span className="text-primary">500+</span> Brands Already Growing with AI
          </h2>
        </motion.div>

        {/* card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="max-w-2xl mx-auto bg-muted/30 border-border/50 shadow-xl p-6 md:p-8 rounded-xl">
            <CardContent className="p-0">
              <blockquote className="text-lg md:text-xl italic text-foreground/90">
                {'"Transformellica found $50K worth of missed opportunities in our first report. This AI is scary good."'}
              </blockquote>
              <p className="text-right mt-4 font-semibold text-primary">
                - Marketing Director, Fortune 500 Company
              </p>
            </CardContent>
          </Card>
        </motion.div>

      </div>

    </section>
  );
};

export default SocialProofSection;
