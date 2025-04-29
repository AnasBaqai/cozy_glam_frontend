import React from "react";

const phrases = [
  "TRANSFORM YOUR HOME, ONE UPGRADE AT A TIME,EXPLORE COZY & STYLISH FASHION",
  "STAY CHIC, STAY CONFIDENT,DISCOVER TRENDY FASHION THAT ELEVATES YOUR STYLE",
];

const Marquee: React.FC = () => (
  <div className="w-full bg-black overflow-hidden h-9">
    <div className="relative flex items-center h-full">
      {/* First set of phrases */}
      <div className="flex absolute whitespace-nowrap animate-marquee">
        {phrases.map((phrase, idx) => (
          <span key={idx} className="text-white text-sm font-medium mx-8">
            {phrase} <span className="text-white/50 mx-2">•</span>
          </span>
        ))}
      </div>

      {/* Second set of phrases for seamless loop */}
      <div className="flex absolute whitespace-nowrap animate-marquee">
        {phrases.map((phrase, idx) => (
          <span
            key={`second-${idx}`}
            className="text-white text-sm font-medium mx-8"
          >
            {phrase} <span className="text-white/50 mx-2">•</span>
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default Marquee;
