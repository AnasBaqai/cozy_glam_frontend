// Category related types
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

// Subcategory related types
export interface SubCategory {
  _id: string;
  name: string;
  imageUrl?: string;
  type: string;
  category: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
}

export interface SubCategoryResponse {
  status: boolean;
  responseCode: number;
  message: string;
  data: {
    subcategories: SubCategory[];
    totalPages: number;
    currentPage: number;
    totalSubCategory: number;
  };
}

// Mock product data for subcategories
export interface MockProduct {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
}

// Component props types
export interface SubCategoryCardProps {
  name: string;
  image?: string;
  categoryName: string;
}

export interface ProductSubcategoryCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  description?: string;
  categoryName: string;
  subcategoryName: string;
}
