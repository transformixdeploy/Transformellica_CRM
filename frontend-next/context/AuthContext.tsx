"use client";
import { createContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {logout, refresh} from "@/utilities/axiosRequester";

enum Roles {
  client = "client",
  admin = "admin"
}

interface User {
  fullName: string,
  email: string,
  role: Roles
}

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isAuthenticated: boolean,
  isLoading: boolean,
  user: User | null,
};

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: ()=>{},
  isAuthenticated: false,
  isLoading: true,
  user: null
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Track initial load
  
  const isAuthenticated = !!accessToken;
  const user : User | null = !!accessToken ? jwtDecode(accessToken) : null;

  // Function to refresh access token
  const refreshAccessToken = async () => {
    try {
      const response = await refresh();
      setAccessToken(response.data.accessToken);
      console.log("new access token is generated");
    } catch (error) {
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    if(!accessToken){
      refreshAccessToken();
    }else{
      setIsLoading(false);
    }
  }, [])


  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isAuthenticated, user, isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};