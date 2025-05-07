import { ReactNode } from "react";

// Define sidebar navigation items
export interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  count?: number;
}

export interface SellerSidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}
