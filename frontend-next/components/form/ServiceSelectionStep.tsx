"use client";
import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Service } from '../../lib/formConfig';
import { BarChartBig, ArrowLeft } from 'lucide-react'; // Import BarChart icon
import Link from 'next/link';

interface ServiceSelectionStepProps {
  services: Service[];
  onSelect: (service: Service) => void;
  direction: number;
  variants: Variants;
}

// this component just returns list of cards for each service we provide
// where each service card sets the "selectedService" variable in "MultiStepFormWizard" component when clicking on it using the "onSelect()" function it gets from the wizard component it self
const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({ services, onSelect, direction, variants }) => {
  const [showSocialSub, setShowSocialSub] = useState(false);

  // Filter to get social analysis services only as we will need an array of them later to show them seperatly
  const socialServices = services.filter(s => s.id === 'instagram_analysis' || s.id === 'tiktok_analysis' || s.id === 'all_social_analysis');
  // Filter to get the rest of services
  const otherServices = services.filter(s => s.id !== 'instagram_analysis' && s.id !== 'tiktok_analysis' && s.id !== 'all_social_analysis');

  if (showSocialSub) {
    return (
      <motion.div
        key="socialSubSelection"
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
        className="space-y-4"
      >
        <Button 
          onClick={() => setShowSocialSub(false)} 
          variant="outline" 
          className="w-full sm:w-auto hover:border-primary/50 text-sm md:text-base"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Main Services
        </Button>

        {/* Social analysis services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {socialServices.map(service => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card
                  onClick={() => onSelect(service)}
                  className="cursor-pointer hover:border-primary transition-all duration-200 h-full flex flex-col justify-center text-center p-3 md:p-4 bg-background/50 hover:bg-muted/50"
                >
                  <CardHeader className="p-1 md:p-2 text-center flex flex-col items-center">
                    <Icon className="w-6 h-6 mb-1 text-primary"/>
                    <CardTitle className="text-sm md:text-md font-semibold">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-1 md:p-2 text-xs md:text-sm text-muted-foreground">
                    {service.description}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="mainServiceSelection"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
    >

      {/* Social analysis main service */}
      <motion.div
        key="social_analysis"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Card
          onClick={() => setShowSocialSub(true)}
          className="cursor-pointer hover:border-primary transition-all duration-200 h-full flex flex-col justify-center text-center p-3 md:p-4 bg-background/50 hover:bg-muted/50"
        >
          <CardHeader className="p-1 md:p-2 text-center flex flex-col items-center">
            <BarChartBig className="w-6 h-6 mb-1 text-primary"/>
            <CardTitle className="text-sm md:text-md font-semibold">Social Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-1 md:p-2 text-xs md:text-sm text-muted-foreground">
            {"Analyze your social media platforms' strengths, weaknesses, opportunities, and threats."}
          </CardContent>
        </Card>
      </motion.div>

      {/* Rest of services */}
      {otherServices.map(service => {
        const Icon = service.icon;
        return (
          <motion.div
            key={service.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Card
              onClick={() => onSelect(service)}
              className="cursor-pointer hover:border-primary transition-all duration-200 h-full flex flex-col justify-center text-center p-3 md:p-4 bg-background/50 hover:bg-muted/50"
            >
              <CardHeader className="p-1 md:p-2 text-center flex flex-col items-center">
                <Icon className="w-6 h-6 mb-1 text-primary"/>
                <CardTitle className="text-sm md:text-md font-semibold">{service.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-1 md:p-2 text-xs md:text-sm text-muted-foreground">
                {service.description}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}

      {/* Bi Analysis service */}
      <motion.div
        key="biAnalystTool"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Link href={"/bi-analysis/how-it-works"}>
          <Card
            className="cursor-pointer hover:border-primary transition-all duration-200 h-full flex flex-col justify-center text-center p-3 md:p-4 bg-background/50 hover:bg-muted/50"
          >
            <CardHeader className="p-1 md:p-2 text-center flex flex-col items-center">
              <BarChartBig className="w-6 h-6 mb-1 text-primary"/>
              <CardTitle className="text-sm md:text-md font-semibold">BI Analyst Tool</CardTitle>
            </CardHeader>
            <CardContent className="p-1 md:p-2 text-xs md:text-sm text-muted-foreground">
              Unlock powerful insights with our custom BI analysis services.
            </CardContent>
          </Card>
        </Link>
      </motion.div>


    </motion.div>
  );
};

export default ServiceSelectionStep;