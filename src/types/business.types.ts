import { ChangeEvent } from "react";

// Form data interface for BusinessInfoForm
export interface BusinessFormData {
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
  postalCode: string;
  website: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

// Props interfaces for business info components
export interface BusinessInfoFieldsProps {
  form: BusinessFormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
  setPreviewImage: React.Dispatch<React.SetStateAction<string | null>>;
  onFileSelect: (file: File) => void;
  uploadLoading?: boolean;
  sizeError: string | null;
  setSizeError: React.Dispatch<React.SetStateAction<string | null>>;
  isRequired?: boolean;
}

export interface SocialLinksSetupProps {
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  setSocial: (platform: SocialPlatform, value: string) => void;
}

export interface SocialModalProps {
  open: boolean;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  platform: SocialPlatform;
  value: string;
  onChange: (value: string) => void;
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
    instagram: "https://instagram.com/your_username",
    facebook: "https://facebook.com/your_username",
    tiktok: "https://tiktok.com/@your_username",
  },
};

export interface BusinessInfoFormProps {
  isUpdateMode?: boolean;
}

export interface StoreInfoCardProps {
  storeName: string;
  storeDescription: string;
  storeLogo: string;
  onClick: () => void;
}
