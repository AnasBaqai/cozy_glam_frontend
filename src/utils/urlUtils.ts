/**
 * Convert a string to a URL-friendly slug
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

/**
 * Extract a category or subcategory name from a slug
 * @param slug The URL slug to convert back to a readable name
 * @returns A readable name with proper capitalization
 */
export const slugToName = (slug: string): string => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
