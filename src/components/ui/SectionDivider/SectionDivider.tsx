import React from "react";

interface SectionDividerProps {
  variant?: "dots" | "wave" | "line";
  className?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = "dots",
  className = "",
}) => {
  const renderDivider = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex justify-center space-x-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-glam-primary"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-glam-primary opacity-60"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-glam-primary"></div>
          </div>
        );
      case "wave":
        return (
          <div className="relative h-12 overflow-hidden">
            <svg
              className="absolute w-full h-24 text-glam-light fill-current"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
          </div>
        );
      case "line":
      default:
        return (
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <div className="mx-4 w-2 h-2 bg-glam-primary rounded-full"></div>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
        );
    }
  };

  return <div className={`w-full py-6 ${className}`}>{renderDivider()}</div>;
};

export default SectionDivider;
