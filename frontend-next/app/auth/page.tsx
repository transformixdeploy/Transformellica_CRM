"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SignInForm from '../../components/auth/SignInForm';
import SignUpForm from '../../components/auth/SignUpForm';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Zap } from 'lucide-react';

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/20 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >


        <Card className="shadow-2xl border-border/50 bg-card/80 backdrop-blur-lg">
          
          {/* card header */}
          <CardHeader className="text-center">
            <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
            
            {/* title */}
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              {isSignIn ? 'Welcome Back!' : 'Create Your Account'}
            </CardTitle>
            
            {/* description */}
            <CardDescription>
              {isSignIn ? 'Sign in to access your dashboard and reports.' : 'Join Transformellica to unlock AI-powered insights.'}
            </CardDescription>
            </CardHeader>

            {/* content */}
            <CardContent>

            {/* put sign in or sign up form */}
            {isSignIn ? <SignInForm /> : <SignUpForm />}
            
            {/* toggle between sign in and sign up button */}
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsSignIn(!isSignIn)}
                className="font-medium text-primary hover:text-primary/80"
              >
                {isSignIn ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </Button>
            </div>
          </CardContent>
        </Card>


      </motion.div>
    </div>
  );
};

export default AuthPage;
