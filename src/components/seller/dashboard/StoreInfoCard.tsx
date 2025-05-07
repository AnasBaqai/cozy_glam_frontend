import React from "react";
import { getFullImageUrl } from "../../../utils/imageUtils";

interface StoreInfoCardProps {
  storeName: string;
  storeDescription: string;
  storeLogo: string;
  onClick: () => void;
}

const StoreInfoCard: React.FC<StoreInfoCardProps> = ({
  storeName,
  storeDescription,
  storeLogo,
  onClick,
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/assets/images/placeholder-store.png";
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      className="bg-white rounded-lg shadow overflow-hidden dashboard-card cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-medium">Store Details</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-glam-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </svg>
      </div>

      <div className="p-4">
        <div className="flex items-start mb-4">
          <div className="w-16 h-16 mr-4 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={getFullImageUrl(storeLogo)}
              alt={`${storeName} logo`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
          <div>
            <h4 className="font-medium text-lg">{storeName}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {storeDescription}
            </p>
          </div>
        </div>

        <div className="mt-2 border-t border-gray-100 pt-4">
          <button
            className="w-full bg-glam-primary text-white rounded-full py-2 px-4 text-sm font-medium hover:bg-glam-dark transition-colors flex items-center justify-center"
            onClick={handleButtonClick}
          >
            <span>Manage store</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoCard;
