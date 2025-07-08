"use client";

import { safeLocalStorage } from "@/config/api";

// Constants for token storage keys
export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

// Cookie settings
const COOKIE_OPTIONS = {
  ACCESS_TOKEN_MAX_AGE: 3600, // 1 hour
  REFRESH_TOKEN_MAX_AGE: 604800, // 7 days
  SAME_SITE: 'strict' as const,
  PATH: '/',
} as const;

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export class TokenManager {
  private static instance: TokenManager;
  
  private constructor() {}
  
  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Store tokens in both localStorage and cookies
   */
  public setTokens(tokenData: TokenData): void {
    const { accessToken, refreshToken } = tokenData;
    
    // Store in localStorage
    safeLocalStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
    safeLocalStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
    
    // Store in cookies for middleware access
    this.setTokenCookie(TOKEN_KEYS.ACCESS_TOKEN, accessToken, COOKIE_OPTIONS.ACCESS_TOKEN_MAX_AGE);
    this.setTokenCookie(TOKEN_KEYS.REFRESH_TOKEN, refreshToken, COOKIE_OPTIONS.REFRESH_TOKEN_MAX_AGE);
  }

  /**
   * Get access token from localStorage or cookies
   */
  public getAccessToken(): string | null {
    // Try localStorage first
    let token = safeLocalStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    
    // Fallback to cookie if localStorage is not available
    if (!token && typeof document !== 'undefined') {
      token = this.getTokenFromCookie(TOKEN_KEYS.ACCESS_TOKEN);
    }
    
    return token;
  }

  /**
   * Get refresh token from localStorage or cookies
   */
  public getRefreshToken(): string | null {
    let token = safeLocalStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    
    if (!token && typeof document !== 'undefined') {
      token = this.getTokenFromCookie(TOKEN_KEYS.REFRESH_TOKEN);
    }
    
    return token;
  }

  /**
   * Clear all tokens from storage and cookies
   */
  public clearTokens(): void {
    // Clear from localStorage
    safeLocalStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    safeLocalStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    
    // Clear cookies
    this.clearTokenCookie(TOKEN_KEYS.ACCESS_TOKEN);
    this.clearTokenCookie(TOKEN_KEYS.REFRESH_TOKEN);
  }

  /**
   * Check if user is authenticated (has valid access token)
   */
  public isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Check if token is expired (basic client-side check)
   */
  public isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true; // If we can't parse, assume expired
    }
  }

  /**
   * Refresh tokens using refresh token
   */
  public async refreshTokens(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken || this.isTokenExpired(refreshToken)) {
        this.clearTokens();
        return false;
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const tokenData = await response.json();
        this.setTokens(tokenData);
        return true;
      } else {
        this.clearTokens();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearTokens();
      return false;
    }
  }

  /**
   * Get authorization header for API calls
   */
  public getAuthorizationHeader(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Set token in cookie
   */
  private setTokenCookie(name: string, value: string, maxAge: number): void {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=${value}; path=${COOKIE_OPTIONS.PATH}; max-age=${maxAge}; SameSite=${COOKIE_OPTIONS.SAME_SITE}`;
    }
  }

  /**
   * Get token from cookie
   */
  private getTokenFromCookie(name: string): string | null {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
          return cookieValue || null;
        }
      }
    }
    return null;
  }

  /**
   * Clear token from cookie
   */
  private clearTokenCookie(name: string): void {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=; path=${COOKIE_OPTIONS.PATH}; max-age=0`;
    }
  }

  /**
   * Extract user info from access token (client-side basic parsing)
   */
  public getUserFromToken(): { username: string; roles: string[] } | null {
    try {
      const token = this.getAccessToken();
      if (!token) return null;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        username: payload.username || '',
        roles: payload.roles || []
      };
    } catch (error) {
      return null;
    }
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();

// Export convenient functions
export const getAccessToken = () => tokenManager.getAccessToken();
export const getRefreshToken = () => tokenManager.getRefreshToken();
export const setTokens = (tokenData: TokenData) => tokenManager.setTokens(tokenData);
export const clearTokens = () => tokenManager.clearTokens();
export const isAuthenticated = () => tokenManager.isAuthenticated();
export const refreshTokens = () => tokenManager.refreshTokens();
export const getAuthorizationHeader = () => tokenManager.getAuthorizationHeader(); 