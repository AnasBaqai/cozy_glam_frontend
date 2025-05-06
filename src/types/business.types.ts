import { RefObject } from "react";

// Form data interface for BusinessInfoForm
export interface BusinessFormData {
  storeName: string;
  storeDescription: string;
  storeLogo: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  country: string;
  city: string;
  state: string;
  postalCode: string;
  website: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

// Props interfaces for business info components
export interface BusinessInfoFieldsProps {
  form: {
    storeName: string;
    storeDescription: string;
    businessEmail: string;
    businessPhone: string;
    businessAddress: string;
    country: string;
    city: string;
    state: string;
    postalCode: string;
    website: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  requiredMark?: boolean;
}

export interface FormHeaderProps {
  title: string;
  progressValue?: number; // Value between 0 and 1
}

export interface FeedbackMessageProps {
  error?: string;
  success?: string;
}

export interface LogoUploadFieldProps {
  previewImage: string | null;
  setPreviewImage: (url: string | null) => void;
  onFileSelect: (file: File) => void;
  uploadLoading?: boolean;
  sizeError: string | null;
  setSizeError: (error: string | null) => void;
  isRequired?: boolean;
}

export interface SocialLinksSetupProps {
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  setSocial: (
    platform: "instagram" | "facebook" | "tiktok",
    value: string
  ) => void;
}

export interface SocialModalProps {
  open: boolean;
  dialogRef: RefObject<HTMLDialogElement | null>;
  platform: "instagram" | "facebook" | "tiktok";
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}

// Type for social platforms
export type SocialPlatform = "instagram" | "facebook" | "tiktok";

// Social media platform metadata
export const SOCIAL_PLATFORM_DATA = {
  icons: {
    instagram: "/icons/instagram.png",
    facebook: "/icons/facebook.png",
    tiktok: "/icons/tiktok.png",
  },
  labels: {
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
  },
  exampleUrls: {
    instagram: "https://instagram.com/yourusername",
    facebook: "https://facebook.com/yourbusiness",
    tiktok: "https://tiktok.com/@yourusername",
  },
};
