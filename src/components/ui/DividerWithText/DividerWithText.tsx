import React from "react";

const DividerWithText: React.FC<{ text: string; className?: string }> = ({
  text,
  className = "",
}) => (
  <div className={`flex items-center my-4 ${className}`}>
    <div className="flex-grow h-px bg-glam-accent" />
    <span className="mx-2 text-glam-dark text-xs whitespace-nowrap">
      {text}
    </span>
    <div className="flex-grow h-px bg-glam-accent" />
  </div>
);

export default DividerWithText;
