"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {logout, refresh} from "@/utilities/axiosRequester";
import { AxiosError } from "axios";
import { apiClient } from "@/utilities/axiosApiClient";
import { useRef } from "react";

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
  const accessTokenRef = useRef<string | null>(null);
  
  const isAuthenticated = !!accessToken;
  const user : User | null = !!accessToken ? jwtDecode(accessToken) : null;
  
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  // Function to refresh access token
  const refreshAccessToken = async () => {
    try {
      const response = await refresh();
      setAccessToken(response.data.accessToken);
      console.log("new access token is generated");
    } catch (error) {
      await logout();
      setAccessToken(null);
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

  // Add request interceptor (re-add on accessToken change to capture latest value)
  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use((config) => {
      
      const token = accessTokenRef.current;

      if (token && !(config as any)._retry) {
        console.log("Attaching access token to the request headers");
        console.log(`Token: ${token}`);
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  // Add response interceptor (once on mount)
  useEffect(() => {
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // If 401/403 and not retried yet → refresh token
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
          console.log("Access token is expired, let's try to refresh it");
          
          originalRequest._retry = true;

          try {
            // Get new token using refresh cookie
            const refreshResponse = await refresh();
            const newAccessToken = refreshResponse.data.accessToken;
            
            console.log("New access token generated.");
            console.log(`New access token aloo: ${newAccessToken}`);
            
            setAccessToken(newAccessToken);
            accessTokenRef.current = newAccessToken;  // Sync ref immediately
            
            // Update header and retry
            originalRequest.headers["Authorization"] = `Bearer ${accessTokenRef.current}`;
            console.log("Retrying the request.");
            return await apiClient(originalRequest);

          } catch (refreshError) {
            console.log("Access token refresh failed → Logging out...");
            await logout();
            setAccessToken(null);
            window.location.href = "/";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, []); // Empty deps: run once

  console.log("Interceptors are initialized");


  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isAuthenticated, user, isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};