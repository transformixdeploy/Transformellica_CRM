"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="py-8 px-4 sm:px-8 border-t border-border bg-muted/30"
    >
      <div className="container mx-auto text-center text-muted-foreground">
        
        {/* Logo with text */}
        <div className="flex items-center justify-center space-x-2 mb-2">
           <Zap className="h-5 w-5 text-primary" />
           <span className="text-lg font-semibold">Transformellica</span>
        </div>

        {/* paragraphs */}
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Transformellica by Transformix. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          AI-Powered Social Media & Website Analysis.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
