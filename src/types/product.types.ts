import { Category, SubCategory } from "../services/api";

// Type for the product form data
export interface ProductFormData {
  title: string;
  description: string;
  price: string;
  quantity: string;
  images: File[];
  category: string;
  subCategories: string[];
}

// Type for image preview
export interface ImagePreview {
  file: File;
  preview: string;
  size: number;
}

// Type for toast notification
export interface ToastMessage {
  visible: boolean;
  message: string;
  type: "success" | "error";
}

// Props interfaces for product components
export interface ProductFormSectionProps {
  title: string;
  children: React.ReactNode;
}

export interface ProductFormHeaderProps {
  title: string;
  subtitle?: string;
}

export interface ProductBasicInfoFieldsProps {
  title: string;
  description: string;
  errors: { [key: string]: string };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export interface ProductPricingFieldsProps {
  price: string;
  quantity: string;
  errors: { [key: string]: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ProductCategorySelectorProps {
  categories: Category[];
  subcategories: SubCategory[];
  selectedCategory: string;
  selectedSubcategories: string[];
  loadingCategories: boolean;
  loadingSubcategories: boolean;
  errors: { [key: string]: string };
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
  onSubcategoryRemove: (subcategoryId: string) => void;
}

export interface ProductImageUploadProps {
  imagePreviews: ImagePreview[];
  setImagePreviews: React.Dispatch<React.SetStateAction<ImagePreview[]>>;
  onImagesChange: (files: File[]) => void;
  totalImageSize: number;
  setTotalImageSize: React.Dispatch<React.SetStateAction<number>>;
  sizeError: string;
  setSizeError: React.Dispatch<React.SetStateAction<string>>;
  maxTotalSize: number;
  errors: { [key: string]: string };
}

export interface ProductFormActionsProps {
  isSubmitting: boolean;
  isDisabled: boolean;
  cancelRoute?: string;
  onSaveAsDraft?: (e: React.FormEvent) => void;
}

export interface ToastNotificationProps {
  visible: boolean;
  type: "success" | "error";
  message: string;
}
