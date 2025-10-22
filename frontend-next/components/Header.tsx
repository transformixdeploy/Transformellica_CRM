"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Zap, LogIn, LogOut, UserCircle, Loader2, Home, CircleQuestionMark } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AuthContext } from '@/context/AuthContext';
import { logout } from '@/utilities/axiosRequester';

const Header = () => {
  const router = useRouter();

  const {user, isAuthenticated, setAccessToken, isLoading} = useContext(AuthContext);

  const handleSignOut = async () => {
    await logout();
    setAccessToken(null);
    router.push('/');
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="py-4 px-4 sm:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border"
    >
      <div className="mx-auto flex justify-between">
        
        {/* Small screens Logo  */}
        <Link href="/" className="items-center space-x-2 max-sm:flex sm:hidden">
          <Zap className="text-primary" />
          <span className="font-bold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Transformellica
          </span>
        </Link>

        {/* Big screens Logo  */}
        <Link href="/" className="items-center space-x-2 max-sm:hidden sm:flex">
          <Zap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Transformellica
          </span>
        </Link>

        {/* Big screens Nav Bar */}
        <nav className="max-sm:hidden flex items-center space-x-6">
          
          {/* Big screens Home  */}
          <Link href="/" className="max-sm:hidden text-sm text-foreground/80 hover:text-primary transition-colors">Home</Link>
          
          {/* How it works */}
          <Link href="/how-it-works" className="text-sm text-foreground/80 hover:text-primary transition-colors">How It Works</Link>
          
          {/* Sign in / Sign out button  */}
          { isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                     <UserCircle className="size-7 text-primary hover:text-primary/80" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : isLoading ? (
              <Loader2 className="h-7 w-7 animate-spin text-primary" aria-label="Loading" />
            ) : (
              <Button onClick={() => router.push('/auth')} size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            )
          }
        </nav>

        {/* Small screens Nav Bar */}
        <nav className="sm:hidden flex items-center space-x-6">
          
          {/* Home */}
          {/* <Link href="/" className="text-sm text-foreground/80 hover:text-primary transition-colors">
            <Home/>
          </Link> */}

          {/* How it works */}
          <Link href="/how-it-works" className="text-sm text-foreground/80 hover:text-primary transition-colors">
            <CircleQuestionMark/>
          </Link>
          
          {/* Sign in / Sign out button  */}
          { isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                     <UserCircle className="size-7 text-primary hover:text-primary/80" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : isLoading ? (
              <Loader2 className="h-7 w-7 animate-spin text-primary" aria-label="Loading" />
            ) : (
              <Button onClick={() => router.push('/auth')} size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            )
          }
        </nav>


      </div>
    </motion.header>
  );
};

export default Header;
