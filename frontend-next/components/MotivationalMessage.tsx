"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// The motivation message that is shown under the progress bar based on questions progress

interface MotivationalMessageProps {
  progress: number;
}

const messages: { [key: number]: string } = {
  25: "Great start! You're building something amazing",
  50: "Halfway there! Your insights are taking shape",
  75: "Almost there! Ready to unlock your business potential",
  100: "Perfect! Generating your analysis report"
};

// Takes the current questions progress to generate the message based on it
const MotivationalMessage: React.FC<MotivationalMessageProps> = ({ progress }) => {
  const [message, setMessage] = useState<string>('');
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    let newMessage = '';
    if (progress >= 100) newMessage = messages[100]; 
    else if (progress >= 75) newMessage = messages[75];
    else if (progress >= 50) newMessage = messages[50];
    else if (progress >= 25) newMessage = messages[25];
    
    if (newMessage && newMessage !== message) {
      setMessage(newMessage);
      setKey(prevKey => prevKey + 1); 
    } else if (progress < 25 && message) {
      setMessage('');
    }
  }, [progress, message]);

  if (!message) return null;

  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.3 }}
      className="text-xs md:text-sm text-center text-primary mt-1 md:mt-2 py-1 px-2 md:px-3 bg-primary/10 rounded-md"
    >
      {message}
    </motion.div>
  );
};

export default MotivationalMessage;
