// Auth Types based on Spring Boot DTOs

// Login Form (from Spring Boot LoginForm.java)
export interface LoginForm {
  username: string;
  password: string;
}

// Signup Form (from Spring Boot SignupForm.java)
export interface SignupForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  address: string;
}

// Login Response (from Spring Boot LoginResponse.java)
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

// Response Message (from Spring Boot ResponseMessage.java)
export interface ResponseMessage {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
}

// User Model (from Spring Boot User.java)
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  roles: Role[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Role Model (from Spring Boot Role.java)
export interface Role {
  id: number;
  name: string;
  description?: string;
}

// JWT Payload
export interface JWTPayload {
  sub: string;
  username: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

// Auth Context State
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Token refresh request
export interface TokenRefreshRequest {
  refreshToken: string;
}

// User profile update request
export interface UserProfileUpdateRequest {
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
