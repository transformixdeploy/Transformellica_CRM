"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Service } from '../../lib/formConfig';
import { BarChart } from 'lucide-react'; // Import BarChart icon
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
  return (
    <motion.div
      key="serviceSelection"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
    >
      {services.map(service => {
        const Icon = service.icon;
        return (<motion.div
          key={service.id}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Card 
            onClick={() => onSelect(service)}
            className="cursor-pointer hover:border-primary transition-all duration-200 h-full flex flex-col items-center justify-center text-center p-3 md:p-4 bg-background/50 hover:bg-muted/50"
          >
            <CardHeader className="p-1 md:p-2 text-center flex flex-col items-center">
              <Icon className="w-6 h-6 mb-1 text-primary"/>
              <CardTitle className="text-sm md:text-md font-semibold">{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-1 md:p-2 text-xs md:text-sm text-muted-foreground">
              {service.description}
            </CardContent>
          </Card>
        </motion.div>)
      })}
      <motion.div
        key="biAnalystTool"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Link href={"/bi-analysis/how-it-works"}>
          <Card
            className="cursor-pointer hover:border-primary transition-all duration-200 h-full flex flex-col items-center justify-center text-center p-3 md:p-4 bg-background/50 hover:bg-muted/50"
          >
            <CardHeader className="p-1 md:p-2 text-center flex flex-col items-center">
              <BarChart className="w-6 h-6 mb-1 text-primary"/>
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
