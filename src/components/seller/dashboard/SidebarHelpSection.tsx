import React from "react";
import { Link } from "react-router-dom";
import { QuestionMark } from "@phosphor-icons/react";

interface SidebarHelpSectionProps {
  collapsed: boolean;
}

const SidebarHelpSection: React.FC<SidebarHelpSectionProps> = ({
  collapsed,
}) => {
  return (
    <div className="mt-auto pt-3 border-t border-gray-200">
      <Link
        to="/help"
        className={`flex items-center ${
          collapsed ? "justify-center px-2" : "px-3"
        } py-1.5 rounded-lg text-gray-600 hover:bg-glam-primary/5 hover:text-glam-primary transition-colors`}
      >
        <QuestionMark className="w-5 h-5" />
        {!collapsed && <span className="ml-2.5 text-xs">Help Center</span>}
      </Link>
    </div>
  );
};

export default SidebarHelpSection;
