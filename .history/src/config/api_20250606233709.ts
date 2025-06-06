export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      SIGNUP: "/auth/signup", 
      REFRESH: "/auth/refresh",
      PROFILE: "/auth/profile",
    },
  },
  TIMEOUT: 10000, // 10 seconds
};

export const getAuthHeader = (token?: string) => {
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem("auth-token") : null);
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const { headers = {}, ...otherOptions } = options;
  
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...headers,
  };

  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...otherOptions,
    headers: defaultHeaders,
  });

  return response;
}; 