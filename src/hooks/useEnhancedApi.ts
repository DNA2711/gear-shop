"use client";

import { useEffect, useState } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { tokenManager } from "@/lib/tokenManager";
import { api } from "@/lib/apiWrapper";

export interface ApiState {
  isAuthenticated: boolean;
  tokenExpired: boolean;
  userInfo: { username: string; roles: string[] } | null;
}

export function useEnhancedApi() {
  const loadingContext = useLoading();
  const [apiState, setApiState] = useState<ApiState>({
    isAuthenticated: false,
    tokenExpired: false,
    userInfo: null,
  });

  // Check authentication status and token validity
  const checkAuthStatus = () => {
    const isAuth = tokenManager.isAuthenticated();
    const userInfo = tokenManager.getUserFromToken();
    const token = tokenManager.getAccessToken();
    const expired = token ? tokenManager.isTokenExpired(token) : false;

    setApiState({
      isAuthenticated: isAuth,
      tokenExpired: expired,
      userInfo: userInfo,
    });

    return { isAuth, expired, userInfo };
  };

  // Initialize auth status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Enhanced API call with pre-flight token validation
  const secureApiCall = async <T = any>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    options?: any
  ): Promise<T> => {
    // Pre-flight check
    const { isAuth, expired } = checkAuthStatus();
    
    if (!isAuth && !url.includes('/auth/')) {
      throw new Error('Not authenticated. Please login first.');
    }

    if (expired && !url.includes('/auth/')) {
      // Try to refresh token before making the call
      const refreshSuccess = await tokenManager.refreshTokens();
      if (!refreshSuccess) {
        throw new Error('Session expired. Please login again.');
      }
      // Update auth status after refresh
      checkAuthStatus();
    }

    // Make the API call using existing api wrapper
    switch (method) {
      case 'get':
        return api.get<T>(url, options);
      case 'post':
        return api.post<T>(url, data, options);
      case 'put':
        return api.put<T>(url, data, options);
      case 'patch':
        return api.patch<T>(url, data, options);
      case 'delete':
        return api.delete<T>(url, options);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  };

  return {
    // Enhanced API methods
    get: <T = any>(url: string, options?: any) => secureApiCall<T>('get', url, undefined, options),
    post: <T = any>(url: string, data?: any, options?: any) => secureApiCall<T>('post', url, data, options),
    put: <T = any>(url: string, data?: any, options?: any) => secureApiCall<T>('put', url, data, options),
    patch: <T = any>(url: string, data?: any, options?: any) => secureApiCall<T>('patch', url, data, options),
    delete: <T = any>(url: string, options?: any) => secureApiCall<T>('delete', url, undefined, options),
    
    // State and utilities
    ...apiState,
    checkAuthStatus,
    refreshTokens: tokenManager.refreshTokens,
    clearTokens: tokenManager.clearTokens,
    
    // Original api for backward compatibility
    api,
  };
} 