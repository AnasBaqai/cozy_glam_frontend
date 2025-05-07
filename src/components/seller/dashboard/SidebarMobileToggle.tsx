import React from "react";

interface SidebarMobileToggleProps {
  toggleSidebar: () => void;
}

const SidebarMobileToggle: React.FC<SidebarMobileToggleProps> = ({
  toggleSidebar,
}) => {
  return (
    <button
      onClick={toggleSidebar}
      className="fixed bottom-6 right-6 z-50 bg-amber-600 text-white rounded-full p-4 shadow-lg md:hidden animate-pulse-subtle"
      aria-label="Toggle sidebar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
};

export default SidebarMobileToggle;
