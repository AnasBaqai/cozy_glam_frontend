import React from "react";
import { ProductFormHeaderProps } from "../../../types/product.types";

const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default ProductFormHeader;
