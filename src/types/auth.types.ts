export interface User {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  skills: string[];
  loyalty_balance: {
    points: number;
  };
  status: string;
  isStoreCreated?: boolean;
  created_at: string;
  updated_at: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: boolean;
  responseCode: number;
  message: string;
  data: {
    user: User;
  };
}
