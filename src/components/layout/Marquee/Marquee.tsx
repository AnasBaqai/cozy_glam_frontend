import React from "react";

const Marquee: React.FC = () => (
  <div className="w-full bg-black overflow-hidden h-9 flex items-center">
    <div className="whitespace-nowrap animate-marquee text-white text-sm font-medium px-4">
      TRANSFORM YOUR HOME, ONE UPGRADE AT A TIME • EXPLORE COZY & STYLISH
      FASHION
    </div>
  </div>
);

export default Marquee;
