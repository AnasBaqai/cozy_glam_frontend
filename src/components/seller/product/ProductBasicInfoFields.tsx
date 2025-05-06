import React from "react";
import ProductFormSection from "./ProductFormSection";
import { ProductBasicInfoFieldsProps } from "../../../types/product.types";

const ProductBasicInfoFields: React.FC<ProductBasicInfoFieldsProps> = ({
  title,
  description,
  errors,
  onChange,
}) => {
  return (
    <ProductFormSection title="Basic Information">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Product Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={onChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter a descriptive title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Describe your product in detail"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>
    </ProductFormSection>
  );
};

export default ProductBasicInfoFields;
