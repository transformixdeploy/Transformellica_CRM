"use client";

import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import {login} from "@/utilities/axiosRequester";
import { AuthContext } from '@/context/AuthContext';
import { getErrorMessage } from '@/utilities/axiosErrorResponseGetter';

const SignInForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitError, setSubmitError] = useState("");

  const {setAccessToken} = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try{
      const response = await login({email, password});
      setAccessToken(response.data.accessToken);
      router.push("/");
    }catch(error: any){
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* email  */}
      <div>
        {/* label */}
        <Label htmlFor="email-signin" className="text-sm font-medium text-foreground/80">Email address</Label>
        
        {/* input */}
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="email-signin"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="pl-10 bg-input border-border/50 focus:ring-primary focus:border-primary"
          />
        </div>

      </div>

      {/* password */}
      <div>
        {/* label */}
        <Label htmlFor="password-signin" className="text-sm font-medium text-foreground/80">Password</Label>
      
        {/* input */}
         <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="password-signin"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 bg-input border-border/50 focus:ring-primary focus:border-primary"
          />
        </div>
        
      </div>

      {/* error message */}
      {submitError && (
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-300 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>{submitError}</span>
        </div>
      )}

      {/* submit button */}
      <div>
        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">
          Sign In
        </Button>
      </div>

    </form>
  );
};

export default SignInForm;
