import React from "react";
import { Link } from "react-router-dom";

interface SidebarUserProfileProps {
  name: string | undefined;
  email: string | undefined;
  collapsed: boolean;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  name,
  email,
  collapsed,
}) => {
  return (
    <div className={`mt-6 mb-6 ${collapsed ? "text-center" : ""}`}>
      <Link to="/profile" className="block group">
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-xl group-hover:bg-glam-primary group-hover:text-white transition-colors">
            {name?.charAt(0) || "S"}
          </div>
        </div>
        {!collapsed && (
          <>
            <h3 className="text-sm font-semibold text-center group-hover:text-glam-primary transition-colors">
              {name || "Seller"}
            </h3>
            <p className="text-xs text-gray-500 text-center truncate">
              {email || "seller@example.com"}
            </p>
          </>
        )}
      </Link>
    </div>
  );
};

export default SidebarUserProfile;
