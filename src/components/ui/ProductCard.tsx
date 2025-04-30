import React from "react";

interface ProductCardProps {
  title: string;
  image: string;
  price?: number;
  quantity?: number;
  onAdd?: () => void;
  onRemove?: () => void;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  image,
  price,
  quantity = 0,
  onAdd,
  onRemove,
  showActions = false,
}) => {
  return (
    <div className="w-full max-w-[300px] sm:w-72 bg-white border border-gray-100 shadow-md rounded-2xl transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 m-1 sm:m-3">
      <figure className="relative h-40 sm:h-48 overflow-hidden rounded-t-2xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
        />
      </figure>
      <div className="p-3 sm:p-4">
        <h2 className="font-semibold text-base sm:text-lg mb-1 flex justify-between items-center">
          {title}
          <span className="badge badge-sm badge-accent text-white font-medium">
            NEW
          </span>
        </h2>
        {price !== undefined && (
          <div className="text-glam-primary font-bold text-base sm:text-lg mb-2">
            ${price.toFixed(2)}
          </div>
        )}
        <p className="text-xs sm:text-sm text-gray-600">
          Explore our stylish {title.toLowerCase()} — curated for comfort and
          elegance.
        </p>
        {showActions && (
          <div className="flex items-center justify-between mt-3 sm:mt-4">
            <div className="flex items-center gap-2">
              <button
                className="btn btn-xs btn-outline btn-circle"
                onClick={onRemove}
                aria-label="Remove one"
                disabled={quantity <= 0}
              >
                -
              </button>
              <span className="font-semibold text-base px-2">{quantity}</span>
              <button
                className="btn btn-xs btn-primary btn-circle"
                onClick={onAdd}
                aria-label="Add one"
              >
                +
              </button>
            </div>
            {onAdd && (
              <button
                className="btn btn-dash btn-warning btn-circle"
                onClick={onAdd}
                aria-label="Add to cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
