import React from "react";
import SocialButton from "../../ui/SocialButton/SocialButton";

const AuthSocialButtons: React.FC = () => (
  <div className="flex justify-center space-x-4 mb-2">
    <SocialButton provider="google" />
    <SocialButton provider="apple" />
    <SocialButton provider="facebook" />
  </div>
);

export default AuthSocialButtons;
