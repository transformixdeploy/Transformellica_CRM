"use client";

import React from 'react';
import { motion } from 'framer-motion';

const ValuePropositionSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-muted/20">
      
      {/* title */}
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold mb-6"
        >
          Why Industry Leaders Choose <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Transformellica</span>
        </motion.h2>
        
        {/* paragprag */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
        >
          The only platform that combines social media analysis, website audits, sentiment tracking, and brand evaluation into one intelligent AI agent. Finally, all your marketing insights in one place.
        </motion.p>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
