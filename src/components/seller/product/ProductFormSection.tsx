import React from "react";
import { ProductFormSectionProps } from "../../../types/product.types";

const ProductFormSection: React.FC<ProductFormSectionProps> = ({
  title,
  children,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default ProductFormSection;
