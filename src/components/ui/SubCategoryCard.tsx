import React from "react";
import { Link } from "react-router-dom";
import { SubCategoryCardProps } from "../../types/category.types";
import { createSlug } from "../../utils/urlUtils";
import { storeCategoryId, storeSubcategoryId } from "../../utils/categoryUtils";

const SubCategoryCard: React.FC<SubCategoryCardProps> = ({
  name,
  image,
  categoryName,
  id,
  categoryId,
}) => {
  // Default image if none provided
  const defaultImage =
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38";

  // Handle click to store IDs
  const handleSubcategoryClick = () => {
    if (categoryId) {
      storeCategoryId(createSlug(categoryName), categoryId);
    }
    if (id) {
      storeSubcategoryId(createSlug(name), id);
    }
  };

  return (
    <Link
      to={`/category/${createSlug(categoryName)}/${createSlug(name)}`}
      className="block w-full transition-transform duration-300 hover:-translate-y-1"
      onClick={handleSubcategoryClick}
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="h-32 overflow-hidden">
          <img
            src={image || defaultImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="p-4 mt-2">
          <h3 className="font-medium text-gray-800">{name}</h3>
          <div className="mt-2 flex items-center">
            <span className="text-xs text-gray-500">{categoryName}</span>
            <svg
              className="h-3 w-3 mx-1 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-xs text-amber-600 font-medium">
              View Products
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SubCategoryCard;
