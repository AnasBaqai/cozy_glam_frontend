import { useState, useEffect } from "react";

/**
 * Custom hook to manage sidebar collapsed state based on screen size
 * @returns {[boolean, (value: boolean) => void]} Tuple with collapsed state and setter
 */
export const useSidebarState = () => {
  // Initialize with true (collapsed) for mobile and false for desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);

  // Update sidebar state when screen size changes
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Only auto-collapse when switching from desktop to mobile
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return [sidebarCollapsed, setSidebarCollapsed] as const;
};

export default useSidebarState;
