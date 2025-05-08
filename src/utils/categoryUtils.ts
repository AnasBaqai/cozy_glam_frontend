/**
 * Utility functions for managing category and subcategory data
 */

// Store category id by slug
export const storeCategoryId = (slug: string, id: string): void => {
  localStorage.setItem(`categoryId_${slug}`, id);
};

// Get category id by slug
export const getCategoryId = (slug: string): string => {
  return localStorage.getItem(`categoryId_${slug}`) || "";
};

// Store subcategory id by slug
export const storeSubcategoryId = (slug: string, id: string): void => {
  localStorage.setItem(`subcategoryId_${slug}`, id);
};

// Get subcategory id by slug
export const getSubcategoryId = (slug: string): string => {
  return localStorage.getItem(`subcategoryId_${slug}`) || "";
};

// Clear all category and subcategory data
export const clearCategoryData = (): void => {
  // Get all localStorage keys
  const keys = Object.keys(localStorage);

  // Filter for category and subcategory related keys
  const categoryKeys = keys.filter(
    (key) => key.startsWith("categoryId_") || key.startsWith("subcategoryId_")
  );

  // Remove each key
  categoryKeys.forEach((key) => localStorage.removeItem(key));
};
