import React from "react";
import cozyGlamLogo from "../../../assets/images/cozy_glam_logo-removebg-preview.png";

const LogoSection: React.FC = () => (
  <div className="flex flex-col items-center mb-6">
    <div className="w-32 h-32 flex items-center justify-center">
      <img
        src={cozyGlamLogo}
        alt="Cozy Glam Logo"
        className="w-full h-full object-contain mix-blend-multiply"
      />
    </div>
  </div>
);

export default LogoSection;
