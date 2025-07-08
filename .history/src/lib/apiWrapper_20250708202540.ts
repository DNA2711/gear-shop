import { safeLocalStorage } from "@/config/api";
import { tokenManager } from "@/lib/tokenManager";

interface ApiOptions extends RequestInit {
  showLoading?: boolean;
  loadingMessage?: string;
}

let loadingContext: any = null;

export const setLoadingContext = (context: any) => {
  loadingContext = context;
};

/**
 * Wrapper cho fetch API với automatic loading state management
 *
 */
export const apiCall = async (
  url: string,
  options: ApiOptions = {}
): Promise<Response> => {
  const {
    showLoading = true,
    loadingMessage = "Đang xử lý...",
    headers = {},
    ...restOptions
  } = options;

  // Get token using TokenManager
  const authHeaders = tokenManager.getAuthorizationHeader();

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders,
    ...headers,
  };

  if (showLoading && loadingContext) {
    loadingContext.showLoading(loadingMessage);
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: defaultHeaders,
    });

    return response;
  } finally {
    if (showLoading && loadingContext) {
      loadingContext.hideLoading();
    }
  }
};

/**
 * Wrapper cho fetch với automatic JSON parsing, error handling và token refresh
 * 
 */
export const apiRequest = async <T = any>(
  url: string,
  options: ApiOptions = {}
): Promise<T> => {
  let response = await apiCall(url, options);

  // If token expired, try to refresh and retry once
  if (response.status === 401 && !url.includes('/auth/')) {
    const refreshSuccess = await tokenManager.refreshTokens();
    
    if (refreshSuccess) {
      // Retry with new token
      response = await apiCall(url, options);
    } else {
      // Refresh failed, redirect to login or clear auth state
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export const api = {
  get: <T = any>(url: string, options?: Omit<ApiOptions, "method">) =>
    apiRequest<T>(url, { ...options, method: "GET" }),

  post: <T = any>(
    url: string,
    data?: any,
    options?: Omit<ApiOptions, "method" | "body">
  ) =>
    apiRequest<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(
    url: string,
    data?: any,
    options?: Omit<ApiOptions, "method" | "body">
  ) =>
    apiRequest<T>(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(
    url: string,
    data?: any,
    options?: Omit<ApiOptions, "method" | "body">
  ) =>
    apiRequest<T>(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(url: string, options?: Omit<ApiOptions, "method">) =>
    apiRequest<T>(url, { ...options, method: "DELETE" }),
};
