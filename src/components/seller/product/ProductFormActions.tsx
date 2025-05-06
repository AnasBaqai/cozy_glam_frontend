import React from "react";
import { useNavigate } from "react-router-dom";
import { ProductFormActionsProps } from "../../../types/product.types";

const ProductFormActions: React.FC<ProductFormActionsProps> = ({
  isSubmitting,
  isDisabled,
  cancelRoute = "/dashboard",
}) => {
  const navigate = useNavigate();

  return (
    <div className="pt-4 flex justify-end">
      <button
        type="button"
        onClick={() => navigate(cancelRoute)}
        className="mr-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting || isDisabled}
        className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center ${
          isSubmitting || isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Creating Product...
          </>
        ) : (
          "Create Product"
        )}
      </button>
    </div>
  );
};

export default ProductFormActions;
