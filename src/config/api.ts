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

// Safe localStorage operations
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(key);
      // Kiểm tra nếu item là string hợp lệ
      if (item && typeof item === "string") {
        return item;
      }
      return null;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      // Xóa item bị corrupt
      try {
        localStorage.removeItem(key);
      } catch (removeError) {
        console.error(
          `Error removing corrupt localStorage key "${key}":`,
          removeError
        );
      }
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },
};

export const getAuthHeader = (token?: string): Record<string, string> => {
  const authToken = token || safeLocalStorage.getItem("auth-token");
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const { headers = {}, ...otherOptions } = options;

  const authHeaders = getAuthHeader();
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...authHeaders,
    ...(headers as Record<string, string>),
  };

  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...otherOptions,
    headers: defaultHeaders,
  });

  return response;
};
