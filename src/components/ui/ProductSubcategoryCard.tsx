import React from "react";
import { useCart } from "../../context/CartContext";
import { ProductSubcategoryCardProps } from "../../types/category.types";

const ProductSubcategoryCard: React.FC<ProductSubcategoryCardProps> = ({
  id,
  title,
  image,
  price,
  description,
  categoryName,
  subcategoryName,
}) => {
  const { addToCart, removeFromCart, getItemCount } = useCart();
  const quantity = getItemCount(id);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-0 left-0 bg-amber-500 text-white px-2 py-1 text-xs font-medium rounded-br-lg">
          {subcategoryName}
        </div>
        {categoryName && (
          <div className="absolute top-0 right-0 bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded-bl-lg">
            {categoryName}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
            ${price.toFixed(2)}
          </span>
        </div>

        {description && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => removeFromCart(id)}
              disabled={quantity <= 0}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              aria-label="Remove one"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <span className="font-medium text-gray-800">{quantity}</span>

            <button
              onClick={() => addToCart({ id, title, image, price })}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-amber-500 bg-amber-500 text-white hover:bg-amber-600 hover:border-amber-600"
              aria-label="Add one"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={() => addToCart({ id, title, image, price })}
            className="btn btn-sm bg-amber-500 hover:bg-amber-600 border-amber-500 hover:border-amber-600 text-white rounded-full px-4"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSubcategoryCard;
