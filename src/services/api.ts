import axios from "axios";
import type {
  SignupRequest,
  LoginRequest,
  AuthResponse,
} from "../types/auth.types";
import {
  Category,
  CategoryResponse,
  SubCategory,
  SubCategoryResponse,
} from "../types/category.types";
import { UserProfileResponse } from "../types/dashboard.types";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies for all requests
});

// Create a separate instance for file uploads
const uploadApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true, // Include credentials for CORS
});

// Helper function to set a cookie
const setCookie = (name: string, value: string, days: number = 30) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

// Helper function to get a cookie
const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Add request interceptor to include auth token if available for both instances
api.interceptors.request.use(
  (config) => {
    // Try to get token from cookie first, then fall back to localStorage
    const tokenFromCookie = getCookie("token");
    const tokenFromStorage = localStorage.getItem("token");
    const token = tokenFromCookie || tokenFromStorage;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

uploadApi.interceptors.request.use(
  (config) => {
    // Try to get token from cookie first, then fall back to localStorage
    const tokenFromCookie = getCookie("token");
    const tokenFromStorage = localStorage.getItem("token");
    const token = tokenFromCookie || tokenFromStorage;

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

    // Store token in both localStorage and cookies
    if (response.data?.data?.user?.token) {
      const token = response.data.data.user.token;
      localStorage.setItem("token", token);
      setCookie("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Also clear the cookie
    setCookie("token", "", -1); // Expire immediately
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    // Try cookie first, then localStorage
    return getCookie("token") || localStorage.getItem("token");
  },

  isAuthenticated: () => {
    // Check both cookie and localStorage
    return !!(getCookie("token") || localStorage.getItem("token"));
  },
};

export interface StoreData {
  _id?: string;
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

export interface StoreResponse {
  status: boolean;
  responseCode: number;
  message: string;
  data: {
    stores: Array<{
      _id: string;
      userId: {
        _id: string;
        name: string;
        email: string;
        phone_number: string;
      };
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
      isVerified: boolean;
      isActive: boolean;
      rating: number;
      productsCount: number;
      joinedAt: string;
      createdAt: string;
      updatedAt: string;
    }>;
    totalPages: number;
    currentPage: number;
    totalStore: number;
  };
}

export const storeService = {
  createStore: async (storeData: StoreData) => {
    const response = await api.post("/store/createstore", storeData);
    return response.data;
  },

  getStore: async (): Promise<StoreResponse> => {
    const response = await api.get<StoreResponse>("/store/getstore");
    return response.data;
  },

  updateStore: async (storeData: StoreData, storeId?: string) => {
    if (!storeId && storeData._id) {
      storeId = storeData._id;
    }

    if (!storeId) {
      throw new Error("Store ID is required for updating");
    }

    const response = await api.put(`/store/updateStore/${storeId}`, storeData);
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

// Export types from category.types.ts
export type { Category, CategoryResponse, SubCategory, SubCategoryResponse };

export const categoryService = {
  getCategories: async (
    page: number = 1,
    limit: number = 100
  ): Promise<CategoryResponse> => {
    const response = await api.get<CategoryResponse>(
      `/categories/allcategories?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Update with the real API endpoint and handle the response correctly
  getSubCategories: async (
    categoryId: string,
    page: number = 1,
    limit: number = 100
  ): Promise<SubCategoryResponse> => {
    try {
      console.log(
        `Calling API: /subcategories/getsubcategories?categoryId=${categoryId}&page=${page}&limit=${limit}`
      );
      const response = await api.get<SubCategoryResponse>(
        `/subcategories/getsubcategories?categoryId=${categoryId}&page=${page}&limit=${limit}`
      );
      console.log("Raw API response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      throw error;
    }
  },

  // Keep the mock function for fallback
  getMockSubCategories: (categoryId: string): SubCategory[] => {
    // This is a mock function that returns fake subcategories based on category ID
    // We'll use this until the real API endpoint is available
    const mockSubcategories: Record<string, SubCategory[]> = {
      // Fashion category subcategories
      fashion123: [
        {
          _id: "sub1",
          name: "Men's Clothing",
          category: {
            _id: "fashion123",
            name: "Fashion",
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          type: "subcategory",
          imageUrl:
            "https://images.unsplash.com/photo-1521334884684-d80222895322",
        },
        {
          _id: "sub2",
          name: "Women's Clothing",
          category: {
            _id: "fashion123",
            name: "Fashion",
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          type: "subcategory",
          imageUrl:
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
        },
        {
          _id: "sub3",
          name: "Accessories",
          category: {
            _id: "fashion123",
            name: "Fashion",
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          type: "subcategory",
          imageUrl:
            "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d",
        },
        {
          _id: "sub4",
          name: "Footwear",
          category: {
            _id: "fashion123",
            name: "Fashion",
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          type: "subcategory",
          imageUrl: "https://images.unsplash.com/photo-1560343090-f0409e92791a",
        },
      ],
      // Electronics category subcategories
      electronics123: [
        {
          _id: "sub5",
          name: "Smartphones",
          category: {
            _id: "electronics123",
            name: "Electronics",
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          type: "subcategory",
          imageUrl:
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
        },
        {
          _id: "sub6",
          name: "Laptops",
          category: {
            _id: "electronics123",
            name: "Electronics",
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          type: "subcategory",
          imageUrl:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
        },
        {
          _id: "sub7",
          name: "Tablets",
          category: {
            _id: "electronics123",
            name: "Electronics",
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          type: "subcategory",
          imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
        },
        {
          _id: "sub8",
          name: "Wearables",
          category: {
            _id: "electronics123",
            name: "Electronics",
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          type: "subcategory",
          imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
        },
      ],
      // Home & Kitchen category subcategories
      home123: [
        {
          _id: "sub9",
          name: "Furniture",
          category: {
            _id: "home123",
            name: "Home & Kitchen",
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          type: "subcategory",
          imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
        },
        {
          _id: "sub10",
          name: "Kitchen Appliances",
          category: {
            _id: "home123",
            name: "Home & Kitchen",
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          type: "subcategory",
          imageUrl:
            "https://images.unsplash.com/photo-1574269366091-705f4687f706",
        },
        {
          _id: "sub11",
          name: "Home Decor",
          category: {
            _id: "home123",
            name: "Home & Kitchen",
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          type: "subcategory",
          imageUrl:
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38",
        },
        {
          _id: "sub12",
          name: "Bedding",
          category: {
            _id: "home123",
            name: "Home & Kitchen",
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          type: "subcategory",
          imageUrl:
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
        },
      ],
    };

    // Return subcategories for the given category ID, or an empty array if none found
    return mockSubcategories[categoryId] || [];
  },
};

// Add interfaces and methods for product service
export interface Product {
  title: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
  seller_id: string;
  categories: string;
  subcategories: string[];
  status?: "active" | "draft";
}

export interface ProductResponse {
  status: boolean;
  responseCode: number;
  message: string;
  data: {
    product: Product;
  };
}

export const productService = {
  createProduct: async (productData: Product): Promise<ProductResponse> => {
    console.log(
      "productService.createProduct called with data:",
      JSON.stringify(productData, null, 2)
    );
    try {
      const response = await api.post<ProductResponse>(
        "/products/createproduct",
        productData
      );
      console.log("Product API response:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("Error in productService.createProduct:", error);
      const axiosError = error as {
        response?: { data?: Record<string, unknown>; status?: number };
      };
      if (axiosError.response) {
        console.error("Response data:", axiosError.response.data);
        console.error("Response status:", axiosError.response.status);
      }
      throw error;
    }
  },

  getSellerProducts: async (
    status?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    status: boolean;
    responseCode: number;
    message: string;
    data: {
      products: Array<{
        _id: string;
        seller_id: {
          _id: string;
          name: string;
          email: string;
        };
        title: string;
        description: string;
        price: number;
        inventory_count: number;
        subcategories: string[];
        tags: string[];
        images: string[];
        quantity: number;
        status: string;
        reviews: unknown[];
        ratings: {
          average: number;
          count: number;
        };
        created_at: string;
        updated_at: string;
      }>;
      total: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    };
  }> => {
    let url = `/products/getProductSeller?page=${page}&limit=${limit}`;

    if (status) {
      url += `&status=${status}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  getProductsByCategoryAndSubcategory: async (
    category_id: string,
    subcategory_id?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    status: boolean;
    responseCode: number;
    message: string;
    data: {
      products: Array<{
        _id: string;
        seller_id: {
          _id: string;
          name: string;
          email: string;
        };
        title: string;
        description: string;
        price: number;
        inventory_count: number;
        categories: {
          _id: string;
          name: string;
        };
        subcategories: Array<{
          _id: string;
          name: string;
        }>;
        tags: string[];
        images: string[];
        quantity: number;
        status: string;
        ratings: {
          average: number;
          count: number;
        };
        reviews: Array<{
          _id: string;
          user_id: string;
          rating: number;
          comment: string;
          created_at: string;
        }>;
        created_at: string;
        updated_at: string;
      }>;
      total: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    };
  }> => {
    let url = `/products/getProduct?category_id=${category_id}&page=${page}&limit=${limit}`;

    if (subcategory_id) {
      url += `&subcategory_id=${subcategory_id}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  getProductById: async (
    productId: string
  ): Promise<{
    status: boolean;
    responseCode: number;
    message: string;
    data: {
      _id: string;
      seller_id: {
        _id: string;
        name: string;
        email: string;
      };
      title: string;
      description: string;
      price: number;
      inventory_count: number;
      categories: {
        _id: string;
        name: string;
      };
      subcategories: Array<{
        _id: string;
        name: string;
      }>;
      tags: string[];
      images: string[];
      quantity: number;
      status: string;
      ratings: {
        average: number;
        count: number;
      };
      reviews: Array<{
        _id: string;
        user_id: string;
        rating: number;
        comment: string;
        created_at: string;
      }>;
      created_at: string;
      updated_at: string;
    };
  }> => {
    const response = await api.get(`/products/getProductById/${productId}`);
    return response.data;
  },
};

// Enhance uploadService to handle multiple files
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

  uploadMultipleImages: async (files: File[]): Promise<string[]> => {
    const imageUrls: string[] = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await uploadApi.post<ImageUploadResponse>(
          "/app/uploadImage",
          formData
        );

        if (response.data.data?.imageUrl) {
          imageUrls.push(response.data.data.imageUrl);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    return imageUrls;
  },
};

export const userService = {
  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await api.get<UserProfileResponse>("/users/getProfile");
    return response.data;
  },
};

export default api;
