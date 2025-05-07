import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavItem } from "../../../types/sidebar.types";

interface SidebarNavigationProps {
  navItems: NavItem[];
  collapsed: boolean;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  navItems,
  collapsed,
}) => {
  const location = useLocation();

  return (
    <nav className="flex-1 overflow-y-auto sidebar-scrollbar">
      <ul className="space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center ${
                  collapsed ? "justify-center" : "justify-between"
                } px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-amber-50 text-amber-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <span
                    className={isActive ? "text-amber-600" : "text-gray-500"}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className={`ml-3 ${isActive ? "font-medium" : ""}`}>
                      {item.label}
                    </span>
                  )}
                </div>
                {!collapsed && item.count !== undefined && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;
