import axios from "axios";
import type {
  SignupRequest,
  LoginRequest,
  AuthResponse,
} from "../types/auth.types";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a separate instance for file uploads
const uploadApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true, // Include credentials for CORS
});

// Add request interceptor to include auth token if available for both instances
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

uploadApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth service
export const authService = {
  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/users/signup", userData);
    return response.data;
  },

  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/users/login", credentials);
    console.log(response.data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export interface StoreData {
  storeName: string;
  storeDescription: string;
  storeLogo: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  country: string;
  city: string;
  state: string;
  postcode: string;
  website: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
}

export const storeService = {
  createStore: async (storeData: StoreData) => {
    const response = await api.post("/store/createstore", storeData);
    return response.data;
  },
};

export interface ImageUploadResponse {
  status: boolean;
  responseCode: number;
  message: string;
  data: {
    imageUrl: string;
  };
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  __v: number;
}

export interface CategoryResponse {
  status: boolean;
  responseCode: number;
  message: string;
  data: {
    categories: Category[];
    totalPages: number;
    currentPage: number;
    totalCategory: number;
  };
}

export const categoryService = {
  getCategories: async (
    page: number = 1,
    limit: number = 12
  ): Promise<CategoryResponse> => {
    const response = await api.get<CategoryResponse>(
      `/categories/allcategories?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

export const uploadService = {
  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await uploadApi.post<ImageUploadResponse>(
      "/app/uploadImage",
      formData
    );
    return response.data;
  },
};

export default api;
