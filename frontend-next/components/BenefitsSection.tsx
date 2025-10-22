"use client";

import React from 'react';
import { motion, easeOut } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Zap, SearchCheck, BarChart3, Presentation, Lightbulb, TrendingUp } from 'lucide-react';
import { JSX } from 'react';

interface Benefit {
  icon: JSX.Element;
  title: string;
  description: string | JSX.Element;
}

const benefits: Benefit[] = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Get Results in Minutes, Not Weeks",
    description: "Skip the endless spreadsheets and manual research. Our AI analyzes months of data across all your channels and delivers actionable insights faster than any human team could.",
  },
  {
    icon: <SearchCheck className="h-8 w-8 text-secondary" />,
    title: "Discover What Your Competition Doesn't Know",
    description: "Our AI identifies hidden patterns, untapped opportunities, and competitive blind spots that traditional analytics tools completely miss.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: "5-in-1 Complete Marketing Intelligence",
    description: (
      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
        <li><strong>Social Media SWOT Analysis</strong> - Instagram performance breakdown</li>
        <li><strong>Website Audit & Optimization</strong> - Technical SEO and UX insights</li>
        <li><strong>Customer Sentiment Analysis</strong> - What people really think about you</li>
        <li><strong>Brand Positioning Audit</strong> - Logo, guidelines, and brand consistency</li>
        <li><strong>All-in-One Power Package</strong> - Complete 360° marketing view</li>
      </ul>
    ),
  },
  {
    icon: <Presentation className="h-8 w-8 text-secondary" />,
    title: "Enterprise-Grade Reports, Zero Setup",
    description: "Professional PDF reports that impress clients and executives. No training required, no monthly subscriptions, no complicated dashboards.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: "AI That Actually Understands Your Business",
    description: "Not just data visualization - our AI provides strategic recommendations tailored to your industry, goals, and market position.",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-secondary" />,
    title: "Stop Leaving Money on the Table",
    description: "Every day without proper analytics is revenue lost. Discover the high-impact changes that can double your ROI overnight.",
  }
];

const BenefitsSection = () => {
  
  // animation variants for each card
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: easeOut
      }
    })
  };

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        
        {/* title */}
        <motion.h2 
          initial={{ opacity: 0, y:20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16"
        >
          Unlock Unprecedented Growth with <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Transformellica</span>
        </motion.h2>

        {/* benefits cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}   // this properties are framer-motion properties
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="h-full"
            >
              
              {/* benefit card */}
              <Card className="bg-muted/30 hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full flex flex-col backdrop-blur-sm border border-border/50 p-6 rounded-xl">
                
                {/* card header */}
                <CardHeader className="p-0 mb-4 flex flex-row items-center space-x-4">
                  <span>{benefit.icon}</span>
                  <CardTitle className="text-xl font-semibold mt-1">{benefit.title}</CardTitle>
                </CardHeader>

                {/* card content  */}
                <CardContent className="p-0 flex-grow">
                  
                  {/* if benefit is just a string style it and if not put it as it is (sometimes it's component) */}
                  {typeof benefit.description === 'string' ? (
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  ) : (
                    benefit.description
                  )}
                </CardContent>

              </Card>


            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default BenefitsSection;
