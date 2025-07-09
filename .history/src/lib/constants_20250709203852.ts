export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

// Cookie settings
export const COOKIE_OPTIONS = {
  ACCESS_TOKEN_MAX_AGE: 3600, // 1 hour
  REFRESH_TOKEN_MAX_AGE: 604800, // 7 days
  SAME_SITE: 'strict' as const,
  PATH: '/',
} as const; 