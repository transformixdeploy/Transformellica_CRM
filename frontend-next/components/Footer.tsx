"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Separator } from "radix-ui";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="py-8 px-4 sm:px-8 border-t border-border bg-muted/30"
    >
      <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-3 container mx-auto text-center text-muted-foreground">
        
        {/* Data */}
        <div>
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

        {/* Seperator */}
        <div className='max-sm:hidden h-full w-[2] mx-auto bg-white rounded-2xl'/>
        <div className='sm:hidden w-full h-[2] my-auto bg-white rounded-2xl'/>
        
        {/* Links */}
        <ul className='my-auto space-y-2'>
          <li><Link href="/about-us" className="text-muted-foreground hover:text-primary transition-colors block py-1">About Us</Link></li>
          <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors block py-1">Privacy Policy</Link></li>
          <li><Link href="/refund-policy" className="text-muted-foreground hover:text-primary transition-colors block py-1">Refund Policy</Link></li>
        </ul>

      </div>
    </motion.footer>
  );
};

export default Footer;
