import React from "react";
import ProductFormSection from "./ProductFormSection";
import { ProductCategorySelectorProps } from "../../../types/product.types";

const ProductCategorySelector: React.FC<ProductCategorySelectorProps> = ({
  categories,
  subcategories,
  selectedCategory,
  selectedSubcategories,
  loadingCategories,
  loadingSubcategories,
  errors,
  onCategoryChange,
  onSubcategorySelect,
  onSubcategoryRemove,
}) => {
  return (
    <ProductFormSection title="Categories">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Dropdown */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={selectedCategory}
              onChange={onCategoryChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a category</option>
              {loadingCategories ? (
                <option disabled>Loading categories...</option>
              ) : (
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
            {loadingCategories && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
              </div>
            )}
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        {/* Subcategories Multi-select */}
        <div>
          <label
            htmlFor="subCategories"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subcategories
          </label>
          <div
            className={`relative rounded-lg border ${
              errors.subCategories ? "border-red-500" : "border-gray-300"
            } focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500`}
          >
            {/* Selected subcategories tags */}
            <div className="p-2 flex flex-wrap gap-2 min-h-[100px] max-h-[200px] overflow-y-auto">
              {loadingSubcategories ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                </div>
              ) : subcategories.length > 0 ? (
                <>
                  {/* Show selected subcategories as tags */}
                  {selectedSubcategories.length > 0 ? (
                    selectedSubcategories.map((subCatId) => {
                      const subCat = subcategories.find(
                        (sc) => sc._id === subCatId
                      );
                      return subCat ? (
                        <div
                          key={subCat._id}
                          className="bg-indigo-100 text-indigo-800 pl-1 pr-2 py-1 rounded-md text-sm flex items-center"
                        >
                          {subCat.imageUrl && (
                            <img
                              src={subCat.imageUrl}
                              alt={subCat.name}
                              className="w-5 h-5 rounded-full object-cover mr-1.5"
                            />
                          )}
                          <span>{subCat.name}</span>
                          <button
                            type="button"
                            onClick={() => onSubcategoryRemove(subCat._id)}
                            className="ml-1.5 text-indigo-500 hover:text-indigo-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <div className="text-gray-500 text-sm py-1 px-2">
                      Click on subcategories below to select them
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 text-sm w-full h-full flex items-center justify-center">
                  {selectedCategory
                    ? "No subcategories available"
                    : "Select a category first"}
                </div>
              )}
            </div>

            {/* Divider */}
            {subcategories.length > 0 && (
              <div className="border-t border-gray-200"></div>
            )}

            {/* Available subcategories list */}
            {subcategories.length > 0 && !loadingSubcategories && (
              <div className="p-2 max-h-[150px] overflow-y-auto">
                <div className="text-xs text-gray-500 mb-1">
                  Available subcategories:
                </div>
                <div className="space-y-1">
                  {subcategories
                    .filter((sub) => !selectedSubcategories.includes(sub._id))
                    .map((subcategory) => (
                      <div
                        key={subcategory._id}
                        onClick={() => onSubcategorySelect(subcategory._id)}
                        className="flex items-center gap-2 text-sm px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        {subcategory.imageUrl && (
                          <img
                            src={subcategory.imageUrl}
                            alt={subcategory.name}
                            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        {subcategory.name}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          {selectedCategory && subcategories.length > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              Click on subcategories to select multiple
            </p>
          )}
          {errors.subCategories && (
            <p className="mt-1 text-sm text-red-500">{errors.subCategories}</p>
          )}
        </div>
      </div>
    </ProductFormSection>
  );
};

export default ProductCategorySelector;
