// User and Authentication Models

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  defaultCurrency: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  theme: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface AuthToken {
  access_token: string;
  expires_in: number;
}
