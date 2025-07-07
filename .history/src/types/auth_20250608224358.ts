// Auth Types based on Spring Boot DTOs

// Login Form (from Spring Boot LoginForm.java)
export interface LoginForm {
  username: string; // email in the backend
  password: string;
}

// Signup Form (from Spring Boot SignupForm.java)
export interface SignupForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phoneNumber?: string;
  address?: string;
  role?: string;
}

// Login Response (from Spring Boot LoginResponse.java)
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number; // in seconds
  fullName?: string;
  email?: string;
  role?: string;
}

// Response Message (from Spring Boot ResponseMessage.java)
export interface ResponseMessage {
  status: number;
  message: string;
  data?: any;
}

// User Model (from Spring Boot User.java)
export interface User {
  id: number;
  name: string;
  username: string; // same as email
  email: string;
  phoneNumber?: string;
  address?: string;
  role: string;
  enabled: boolean;
  createdAt: string;
  avatarCode?: string;
}

// Role Model (from Spring Boot Role.java)
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
