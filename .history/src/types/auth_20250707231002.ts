export interface LoginForm {
  username: string;
  password: string;
}

export interface SignupForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phoneNumber?: string;
  address?: string;
  role?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  fullName?: string;
  email?: string;
  role?: string;
}

export interface ResponseMessage {
  status: number;
  message: string;
  data?: any;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  role: string;
  enabled: boolean;
  createdAt: string;
  avatarCode?: string;
}

export interface Role {
  id: number;
  name: string;
}

// JWT Payload
export interface JwtPayload {
  username: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

// Auth Context State
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

// Token refresh request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// User profile update request
export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
}

// Password change request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Authentication middleware context
export interface AuthContext {
  user: User;
  token: string;
  roles: string[];
}

// Next.js API response types
export interface NextAuthResponse extends Response {
  user?: User;
  token?: string;
}
