import { safeLocalStorage } from "@/config/api";

interface ApiOptions extends RequestInit {
  showLoading?: boolean;
  loadingMessage?: string;
}

let loadingContext: any = null;

// Function to set loading context from component
export const setLoadingContext = (context: any) => {
  loadingContext = context;
};

/**
 * Wrapper cho fetch API với automatic loading state management
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

  // Get auth token
  const token =
    safeLocalStorage.getItem("accessToken") ||
    safeLocalStorage.getItem("token");

  // Build headers
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...headers,
  };

  // Show loading if enabled and context is available
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
    // Hide loading if it was shown
    if (showLoading && loadingContext) {
      loadingContext.hideLoading();
    }
  }
};

/**
 * Wrapper cho fetch với automatic JSON parsing và error handling
 */
export const apiRequest = async <T = any>(
  url: string,
  options: ApiOptions = {}
): Promise<T> => {
  const response = await apiCall(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

/**
 * Helper functions cho các HTTP methods thông dụng
 */
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
