import React from "react";
import { useAppSelector } from "../../../store/hooks";
import { SellerSidebarProps } from "../../../types/sidebar.types";
import "./dashboard.css";

// Import modularized components
import SidebarMobileToggle from "./SidebarMobileToggle";
import SidebarUserProfile from "./SidebarUserProfile";
import SidebarNavigation from "./SidebarNavigation";
import SidebarHelpSection from "./SidebarHelpSection";
import SidebarToggleButton from "./SidebarToggleButton";
import { navItems } from "./navItems";

const SellerSidebar: React.FC<SellerSidebarProps> = ({
  collapsed,
  toggleSidebar,
}) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 md:hidden ${
          !collapsed ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* Mobile toggle button */}
      <SidebarMobileToggle toggleSidebar={toggleSidebar} />

      <aside
        className={`${
          collapsed ? "w-0 md:w-20 -left-64 md:left-0" : "w-64 left-0"
        } bg-white h-screen fixed top-32 transition-all duration-300 shadow-lg z-30 rounded-tr-lg rounded-tl-lg border-t border-gray-100`}
        style={{ height: "calc(100vh - 130px)" }}
      >
        <div className="pt-8 px-4 pb-4 flex flex-col h-full">
          {/* Toggle button */}
          <SidebarToggleButton
            toggleSidebar={toggleSidebar}
            collapsed={collapsed}
          />

          {/* User section */}
          <SidebarUserProfile
            name={user?.name}
            email={user?.email}
            collapsed={collapsed}
          />

          {/* Nav links */}
          <SidebarNavigation navItems={navItems} collapsed={collapsed} />

          {/* Help section */}
          <SidebarHelpSection collapsed={collapsed} />
        </div>
      </aside>
    </>
  );
};

export default SellerSidebar;
