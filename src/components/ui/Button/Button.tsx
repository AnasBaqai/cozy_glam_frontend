import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "social";
  className?: string;
}

const base =
  "rounded-md font-medium focus:outline-none focus:ring-2 transition-colors";
const variants = {
  primary:
    "bg-glam-dark text-white hover:bg-glam-primary focus:ring-glam-primary",
  secondary:
    "bg-glam-accent text-glam-dark hover:bg-glam-primary focus:ring-glam-primary",
  outline:
    "border border-glam-dark text-glam-dark bg-white hover:bg-glam-accent",
  danger: "bg-red-600 text-white hover:bg-red-700",
  social: "bg-white border border-glam-accent shadow hover:bg-gray-100",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => (
  <button className={`${base} ${variants[variant]} ${className}`} {...props}>
    {children}
  </button>
);

export default Button;
