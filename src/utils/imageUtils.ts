/**
 * Gets the full URL for an image path.
 * If the image path starts with http, it's assumed to be a complete URL.
 * Otherwise, it's a relative path to be appended to the API base URL.
 *
 * @param imagePath - The path to the image
 * @returns The full URL to the image
 */
export const getFullImageUrl = (imagePath: string | undefined): string => {
  // If no image path is provided, return a default placeholder
  if (!imagePath) {
    return "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg";
  }

  // If the image path already starts with http, it's already a full URL
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Get the API base URL from environment
  const apiBaseUrl = import.meta.env.VITE_IMAGE_CDN_URL;

  console.log("Image path:", imagePath);
  console.log("API base URL:", apiBaseUrl);

  // Ensure we have a valid base URL
  if (!apiBaseUrl) {
    console.error("Backend URL environment variable is missing");
    return imagePath; // Return the path as-is if no base URL
  }

  // Create a properly formatted URL by ensuring no double slashes
  const baseWithTrailingSlash = apiBaseUrl.endsWith("/")
    ? apiBaseUrl
    : `${apiBaseUrl}/`;
  const pathWithoutLeadingSlash = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;

  const fullUrl = `${baseWithTrailingSlash}${pathWithoutLeadingSlash}`;
  console.log("Full image URL:", fullUrl);

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
