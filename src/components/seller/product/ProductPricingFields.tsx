import React from "react";
import ProductFormSection from "./ProductFormSection";
import { ProductPricingFieldsProps } from "../../../types/product.types";

const ProductPricingFields: React.FC<ProductPricingFieldsProps> = ({
  price,
  quantity,
  errors,
  onChange,
}) => {
  return (
    <ProductFormSection title="Price & Inventory">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*\.?[0-9]*"
              id="price"
              name="price"
              value={price}
              onChange={onChange}
              className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.quantity ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Number of items in stock"
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
          )}
        </div>
      </div>
    </ProductFormSection>
  );
};

export default ProductPricingFields;
