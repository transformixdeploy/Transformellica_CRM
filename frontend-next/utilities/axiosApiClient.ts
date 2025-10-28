// utils/axiosRequester.ts
import axios, { AxiosInstance } from "axios";

const baseBackendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: baseBackendURL,
  withCredentials: true,
});

