// Image utilities
const IMAGE_CDN_URL = import.meta.env.VITE_IMAGE_CDN_URL;

/**
 * Generates a full URL for an image by combining the CDN base URL with the image path
 * @param path - The image path or URL
 * @returns Full image URL
 */
export const getFullImageUrl = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_CDN_URL}${path}`;
};

/**
 * Validates image size
 * @param fileSize - Size of the file in bytes
 * @param maxSize - Maximum allowed size in bytes (default 5MB)
 * @returns Object containing validation result and formatted error message
 */
export const validateImageSize = (
  fileSize: number,
  maxSize: number = 5 * 1024 * 1024
): { isValid: boolean; errorMessage: string | null } => {
  if (fileSize > maxSize) {
    return {
      isValid: false,
      errorMessage: `File is too large. Maximum size is ${(
        maxSize /
        (1024 * 1024)
      ).toFixed(0)}MB. Your file is ${(fileSize / (1024 * 1024)).toFixed(
        2
      )}MB.`,
    };
  }
  return { isValid: true, errorMessage: null };
};

/**
 * Creates a data URL from a file for preview
 * @param file - The file to create preview for
 * @returns Promise that resolves with the data URL
 */
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to create image preview"));
      }
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
};
