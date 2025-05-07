import React from "react";

interface SidebarToggleButtonProps {
  toggleSidebar: () => void;
  collapsed: boolean;
}

const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({
  toggleSidebar,
  collapsed,
}) => {
  return (
    <button
      onClick={toggleSidebar}
      className="absolute top-10 -right-3 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 hidden md:block"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 text-gray-600 transform transition-transform ${
          collapsed ? "" : "rotate-180"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
};

export default SidebarToggleButton;
