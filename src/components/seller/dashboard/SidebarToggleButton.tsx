import React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

interface SidebarToggleButtonProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({
  collapsed,
  toggleSidebar,
}) => {
  return (
    <button
      onClick={toggleSidebar}
      className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1 hover:bg-glam-primary/5 hover:text-glam-primary transition-colors"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? (
        <CaretRight className="w-4 h-4" />
      ) : (
        <CaretLeft className="w-4 h-4" />
      )}
    </button>
  );
};

export default SidebarToggleButton;
