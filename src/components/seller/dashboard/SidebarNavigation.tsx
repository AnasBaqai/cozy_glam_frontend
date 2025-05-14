import React from "react";
import { NavLink } from "react-router-dom";
import { NavItem } from "../../../types/sidebar.types";

interface SidebarNavigationProps {
  collapsed: boolean;
  navItems: NavItem[];
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  collapsed,
  navItems,
}) => {
  return (
    <nav className="flex-1">
      <ul className="space-y-1.5">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center ${
                  collapsed ? "justify-center px-2" : "px-3"
                } py-1.5 rounded-lg text-gray-600 hover:bg-glam-primary/5 hover:text-glam-primary transition-colors ${
                  isActive
                    ? "bg-glam-primary/5 text-glam-primary font-medium"
                    : ""
                }`
              }
            >
              <span className="w-5 h-5">{item.icon}</span>
              {!collapsed && (
                <span className="ml-2.5 text-xs">{item.label}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;
