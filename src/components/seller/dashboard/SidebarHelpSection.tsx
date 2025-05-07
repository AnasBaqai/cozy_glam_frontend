import React from "react";
import { Link } from "react-router-dom";

interface SidebarHelpSectionProps {
  collapsed: boolean;
}

const SidebarHelpSection: React.FC<SidebarHelpSectionProps> = ({
  collapsed,
}) => {
  return (
    <div className="mt-6 pt-4 border-t border-gray-100">
      <Link
        to="/seller/help"
        className={`flex items-center ${
          collapsed ? "justify-center" : ""
        } text-gray-600 hover:text-amber-600 transition-colors`}
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
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {!collapsed && <span className="ml-3">Help Center</span>}
      </Link>
    </div>
  );
};

export default SidebarHelpSection;
