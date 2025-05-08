/**
 * Utility function to construct the full URL for an image based on the API base URL
 * If the image path already starts with http/https, it will be returned as is
 * Otherwise, it will be prefixed with the API base URL
 */
export const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) {
    console.log("No image path provided, using placeholder");
    return "/assets/images/placeholder-image.png";
  }

  // If the image path already includes http/https, return it as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    console.log("Image path already has http/https, using as is:", imagePath);
    return imagePath;
  }

  // Otherwise, prepend the API base URL
  // Get the API base URL from environment or use a default
  const apiBaseUrl = import.meta.env.VITE_IMAGE_CDN_URL;

  // Remove any leading slash from the image path to avoid double slashes
  const cleanImagePath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;

  const fullUrl = `${apiBaseUrl}/${cleanImagePath}`;
  console.log("Full image URL constructed:", fullUrl);
  return fullUrl;
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
