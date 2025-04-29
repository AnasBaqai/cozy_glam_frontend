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
  quantity,
  onAdd,
  onRemove,
  showActions = false,
}) => {
  return (
    <div className="card w-72 bg-white border border-gray-100 shadow-md rounded-2xl transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 m-3">
      <figure className="relative h-48 overflow-hidden rounded-t-2xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="font-semibold text-lg mb-1 flex justify-between items-center">
          {title}
          <span className="badge badge-sm badge-accent text-white font-medium">
            NEW
          </span>
        </h2>
        {price !== undefined && (
          <div className="text-glam-primary font-bold text-lg mb-2">
            ${price.toFixed(2)}
          </div>
        )}
        <p className="text-sm text-gray-600">
          Explore our stylish {title.toLowerCase()} — curated for comfort and
          elegance.
        </p>
        {showActions && (
          <div className="flex items-center gap-2 mt-4">
            {quantity !== undefined && onAdd && onRemove ? (
              <>
                <button
                  className="btn btn-xs btn-outline btn-circle"
                  onClick={onRemove}
                  aria-label="Remove one"
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
              </>
            ) : (
              onAdd && (
                <button
                  className="btn btn-sm btn-primary rounded-full px-4"
                  onClick={onAdd}
                >
                  Add to Cart
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
